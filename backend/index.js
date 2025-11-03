const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// SignUp
app.post("/user/signup",(req,res)=>{
  let {username,password,name} = req.body;
})

//SignIn
app.post("/user/signin",(req,res)=>{

})

// purcase
app.post("/user/purchas",(req,res)=>{

})

// purchases courses
app.get("/user/purchases",(req,res)=>{

})


//  sell all courses
app.get("/courses",(req,res)=>{

})



app.listen(3000);