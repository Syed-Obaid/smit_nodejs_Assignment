const mongoose = require('mongoose');
const {Schema} = mongoose;
var validator = require('validator');
const userSchema = new Schema({
   firstName:{
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
      trim: true,
      lowercase: true
   },
   lastName:{
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
      trim: true,
      lowercase: true
   },
   email:{
      type: String,
      required: true,
      index: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value){
         if(!validator.isEmail(value)){
            throw new Error('Invalid Email')
         }
      }
   },
   password:{
      type: String,
      required: true,
      validate(value){
         if(!validator.isStrongPassword(value)){
             throw new Error('Use Strong Password')
         }
      }
   },
   gender:{
      type: String,
      validate(value){           
         if (!["male","female","others"].includes(value)){
            throw new Error("Invalid gender");
         }
      },
   }

},{
   timestamps: true,
   collection: 'signupcollection'
})



const User = mongoose.model('signupcollection', userSchema);

module.exports ={ User};


