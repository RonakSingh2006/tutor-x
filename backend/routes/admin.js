const {Router} = require('express');
const {adminModel,courseModel} = require('../db');
const JWT_SECRET = process.env.JWT_ADMIN_SECRET;
const z = require('zod');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const adminAuth = require('../middlewares/adminAuth')

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

adminRouter.use(adminAuth);

adminRouter.post("/course", async (req,res)=>{
  const adminId = req.adminId;

  const courseSchema = z.object({
    title : z.string(),
    imageUrl : z.string(),
    description : z.string(),
    price : z.number()
  })

  let parsed = courseSchema.safeParse(req.body);

  if(!parsed.success){
    return res.status(400).send(JSON.parse(parsed.error));
  }

  const {title,imageUrl,description,price} = parsed.data;

  try{
    const course = await courseModel.create({
      title,
      imageUrl,
      description,
      price,
      createrId : adminId
    })

    res.json({
      message : "course added",
      courseId : course._id
    });
  }
  catch(err){
    res.status(400).send(err);
  }

})

adminRouter.put("/course",async (req,res)=>{
  const adminId = req.adminId;

  const courseSchema = z.object({
    title : z.string(),
    imageUrl : z.string(),
    description : z.string(),
    price : z.number(),
    courseId : z.string()
  })

  let parsed = courseSchema.safeParse(req.body);

  if(!parsed.success){
    return res.status(400).send(JSON.parse(parsed.error));
  }

  const {title,imageUrl,description,price,courseId} = parsed.data;

  try{
    await courseModel.updateOne({
      _id : courseId,
      createrId : adminId
    },{
      title,
      imageUrl,
      description,
      price,
      createrId : adminId
    })

    res.send("course updated");
  }
  catch(err){
    res.status(400).send(err);
  }
})

adminRouter.get("/course/bulk", async (req,res)=>{
  const adminId = req.adminId;

  try{
    let courses = await courseModel.find({createrId : adminId});

    res.send(courses);

  }catch(err){
    res.status(400).send(err);
  }
})

module.exports = adminRouter;