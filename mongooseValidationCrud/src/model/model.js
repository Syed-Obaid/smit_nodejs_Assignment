const mongoose = require('mongoose');

const {Schema} = mongoose;

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:30,
        lowercase:true
    },
     lastName:{
        type:String,
        trim:true,
        minlength:3,
        maxlength:30,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        index:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    age:{
        type:Number,
        min:12,
        max: 40
    },
    gender:{
        type:String,
        validate(value){
            if (!["male","female","others"].includes(value)){
                throw new Error("Invalid gender");
            }
        }
    },
    about:{
        type:String,
        default: "About user",
        maxlength:200
    },
    skills:{
        type:[String]
    }    
},
{   
    timestamps:true,
    collection:"newUsers"
}
)

const User = mongoose.model("User",userSchema);

module.exports = {
    User
}