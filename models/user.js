const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    pic:{
        type:String,
        default:"https://res.cloudinary.com/eduhub2/image/upload/v1622993767/51f6fb256629fc755b8870c801092942_izbl5a.png"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})

mongoose.model("User",userSchema)