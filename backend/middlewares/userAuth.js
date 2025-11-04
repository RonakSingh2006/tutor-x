const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_USER_SECRET;

function userAuth(req,res,next){
  const token = req.headers.token;

  try{
    let data = jwt.verify(token,JWT_SECRET);
    req.userId = data.userId;
    next();
  }
  catch(err){
    res.status(401).send("please signin first");
  }
}

module.exports = userAuth;