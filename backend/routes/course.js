const {Router} = require('express');
const {courseModel,purchaseModel} = require('../db');
const userAuth = require("../middlewares/userAuth");
const z = require('zod');
const {mongoose} = require('mongoose');

const courseRouter = Router();

// purchase
courseRouter.post("/purchase",userAuth , async (req,res)=>{
  const userId = req.userId;

  const courseIdSchema = z.object({
    courseId : z.string()
  })

  const parsed = courseIdSchema.safeParse(req.body);

  if(!parsed.success){
    return res.status(400).send(parsed.error)
  }

  const {courseId} = parsed.data;

  if(!mongoose.Types.ObjectId.isValid(courseId)){
    return res.status(400).send("Invalid courseId");
  }
  
  const objCourseId = new mongoose.Types.ObjectId(courseId);

  try{

    let course = await courseModel.findOne({_id : objCourseId});

    if(!course){
      return res.status(400).send("Course Does not exsists");
    }

    await purchaseModel.create({
      userId,
      courseId : objCourseId
    })

    res.send("succesfully purchases the course");
  }
  catch(err){
    res.status(400).send(err);
  }
})

//  sell all courses
courseRouter.get("/preview",async (req,res)=>{
  try{
    let courses = await courseModel.find({});
    res.send(courses);
  }
  catch(err){
    res.status(400).send(err);
  }
})

module.exports = courseRouter;