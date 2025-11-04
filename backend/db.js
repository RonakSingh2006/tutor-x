const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);

const {Schema,model,ObjectId} = mongoose;

const User = new Schema({
  email : {type : String , unique : true},
  password : String,
  firstName : String,
  lastName : String
});


const Admin = new Schema({
  email : {type : String , unique : true},
  password : String,
  firstName : String,
  lastName : String
})

const Course = new Schema({
  title : String,
  createrId : ObjectId,
  imageUrl : String,
  description : String,
  price : Number
})

const Purchase = new Schema({
  userId : ObjectId,
  courseId : ObjectId
})

const userModel = model('users',User);
const adminModel = model('admins',Admin);
const courseModel = model('courses',Course);
const purchaseModel = model('purchases',Purchase);

module.exports = {userModel,adminModel,courseModel,purchaseModel};
