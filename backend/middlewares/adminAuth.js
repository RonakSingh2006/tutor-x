const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_ADMIN_SECRET;

function adminAuth(req,res,next){
  const token = req.headers.token;

  try{
    let data = jwt.verify(token,JWT_SECRET);
    req.adminId = data.adminId;
    next();
  }
  catch(err){
    res.status(401).send("please signin first");
  }
}

module.exports = adminAuth;