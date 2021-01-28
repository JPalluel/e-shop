const mongoose  = require('mongoose');
const validator = require('validator');

const newsLetterSchema = new mongoose.Schema ({
    email :{
        type  : String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
          if(!validator.isEmail(value)){ // if isEmail return false, then throw error
            throw new Error ('Email is invalid')
          }
        }
    }
 })

const newsLetter = mongoose.model ('Newsletter', newsLetterSchema);

module.exports = newsLetter;