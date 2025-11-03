const mongoose = require('mongoose');

mongoose.connect("your mongodb url");

const Schema = mongoose.Schema;

const User = new Schema({
  username : {type : String , unique : true},
  password : String,
  name : String
});


UserModel = mongoose.model('users',User);

