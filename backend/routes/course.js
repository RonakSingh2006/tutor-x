const {Router} = require('express');

const courseRouter = Router();

// purchase
courseRouter.post("/purchase",(req,res)=>{
  res.send("Temp");
})

//  sell all courses
courseRouter.get("/preview",(req,res)=>{
  res.send("Temp");
})

module.exports = courseRouter;