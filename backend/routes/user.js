let { Router } = require('express');

let userRouter = Router();

// SignUp
userRouter.post("/signup",(req,res)=>{
  res.send("Temp");
})

//SignIn
userRouter.post("/signin",(req,res)=>{
  res.send("Temp");
})


// purchased courses
userRouter.get("/purchases",(req,res)=>{
  res.send("Temp");
})


module.exports = userRouter;