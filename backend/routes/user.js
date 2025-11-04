const { Router } = require('express');
const {userModel} = require('../db');
const z = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_USER_SECRET;

const userRouter = Router();

// SignUp
userRouter.post("/signup",async (req,res)=>{
  const user = z.object({
    email : z.email().min(5).max(50),
    password : z.string().min(5).max(20),
    firstName : z.string().min(3).max(20),
    lastName : z.string().min(3).max(20)
  })

  let parsed = user.safeParse(req.body);

  if(!parsed.success){
    return res.status(406).send(JSON.parse(parsed.error));
  }

  let {email,password,firstName,lastName} = parsed.data;
  const hashedPassword = await bcrypt.hash(password,5);

  try{

    await userModel.create({
      email,password : hashedPassword,lastName,firstName
    })

    res.send("Succesfull Registered");
  }
  catch(err){
    res.status(406).send(err);
  }
})

//SignIn
userRouter.post("/signin",async (req,res)=>{
  const signinSchema = z.object({
    email : z.email().min(5).max(50),
    password : z.string().min(5).max(20)
  })

  const parsed = signinSchema.safeParse(req.body);

  if(!parsed.success){
    return res.status(406).send(JSON.parse(parsed.error));
  }

  let {email,password} = parsed.data;

  let user = await userModel.findOne({email});
  if(!user) return res.status(400).send("User doesnot exsist");

  let verify = await bcrypt.compare(password,user.password);
  if(!verify){
    return res.status(401).send("Incorrect Password");
  }

  let token = jwt.sign({userId : user._id},JWT_SECRET);

  res.send({token});

})


// purchased courses
userRouter.get("/purchases",(req,res)=>{
  res.send("Temp");
})


module.exports = userRouter;