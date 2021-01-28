const mongoose  = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
  
 
//There are 3 main stages to creating a model.
// We first build our Schema, that will specify the fields which we want in our collection
//then we compile a model from our schema and lastly
// (and optionally), we can export our Model to our router files for actions, operations and functionality.
const UserSchema  = new mongoose.Schema({
    firstName :{
        type  : String,
        required : true,
        trim: true // remove white space before and after if any
    } ,
    lastName : {
        type : String,
        required : true,
        trim: true
    },
    userName :{
      type  : String,
      required: true,
      trim: true,
      unique: true
    } ,
    email :{
      type  : String,
      required: true,
      trim: true,
      unique :true,
      lowercase: true,
      validate(value){
        if(!validator.isEmail(value)){ // if isEmail return false, then throw error
          throw new Error ('Email is invalid')
        }
      }
    } ,
    password :{
      type  : String,
      required: true,
      minlength : 7,
      trim: true
    } ,
    date :{
      type : Date,
      default : Date.now
    },
});



//here we create a function that will allow us to find user by credentials
UserSchema.statics.findByCredentials = async(userName, password) => {
  const user = await User.findOne({userName}); //mongoose build-in method , allows to filter through all the users,  here async function because we wait for the input of the user

  if(!user){
    throw new Error('Unable to Log in')
  }
  const matchPassword = await bcrypt.compare(password, user.password) //function from bcrypt => check if hashed password = to entered password
  if(!matchPassword){
    throw new Error('Unable to Log in')
  }
  return user
};


//run some code before the user is saved, Hash the plain text password
UserSchema.pre('save', async function (next)  {
  const user = this;
  if(user.isModified('password')){                 //returns true if user's been created or modified
  user.password = await bcrypt.hash(user.password, 8) //crypting the pw, 8 is the number of time we want the methods to run, good balance btw security and speed
  }
next();
})


//User will contain the instance of the userschema for manipulating the data
//When we instantiate this, we create a new user 
const User= mongoose.model('User',UserSchema);

module.exports = User;

 