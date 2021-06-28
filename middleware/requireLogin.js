const jwt = require('jsonwebtoken')
const mongoose= require('mongoose')
const {JWT_SECRET} = require('../config/keys')
const User = mongoose.model("User")

module.exports = (req,res,next) =>{
    const {authorization} = req.headers
    //authorization === Bearer krhkkjehrkkhr
    if(!authorization){
        return res.status(401).json({error:"You must be logged in"})
    }
    const token = authorization.replace("Bearer ","")
    //jwt.verify(token, secretOrPublicKey, [options, callback])
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"You must be logged in"})
        }

        const{_id} = payload
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next()
        })
        
    })
}