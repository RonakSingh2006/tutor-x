const {Router} = require('express');
const {adminModel} = require('../db');
const JWT_SECRET = process.env.JWT_ADMIN_SECRET;
const z = require('zod');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const adminRouter = Router();

adminRouter.post("/signup",async (req,res)=>{
  const adminSchema = z.object({
    email : z.email().min(5).max(50),
    password : z.string().min(5).max(20),
    firstName : z.string().min(3).max(20),
    lastName : z.string().min(3).max(20)
  })

  let parsed = adminSchema.safeParse(req.body);

  if(!parsed.success){
    return res.status(406).send(JSON.parse(parsed.error));
  }

  let {email,password,firstName,lastName} = parsed.data;
  const hashedPassword = await bcrypt.hash(password,5);

  try{

    await adminModel.create({
      email,password : hashedPassword,lastName,firstName
    })

    res.send("Succesfull Registered");
  }
  catch(err){
    res.status(406).send(err);
  }
})

adminRouter.post("/signin",async (req,res)=>{
   const signinSchema = z.object({
    email : z.email().min(5).max(50),
    password : z.string().min(5).max(20)
  })

  const parsed = signinSchema.safeParse(req.body);

  if(!parsed.success){
    return res.status(406).send(JSON.parse(parsed.error));
  }

  let {email,password} = parsed.data;

  let admin = await adminModel.findOne({email});
  if(!admin) return res.status(400).send("Admin doesnot exsist");

  let verify = await bcrypt.compare(password,admin.password);
  if(!verify){
    return res.status(401).send("Incorrect Password");
  }

  let token = jwt.sign({adminId : admin._id},JWT_SECRET);

  res.send({token});
})

adminRouter.post("/course",(req,res)=>{

})

adminRouter.put("/course",(req,res)=>{

})

adminRouter.get("/course/bulk",(req,res)=>{

})

module.exports = adminRouter;