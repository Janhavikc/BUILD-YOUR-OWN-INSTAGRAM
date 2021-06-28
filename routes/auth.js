const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.transporter(sendgridTransport({
    auth:{
        api_key:""
    }
}))
// token ==> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmM3YWZhNWNjZmQ0OTBlNmMxZjlkOGIiLCJpYXQiOjE2MDY5MjU1MTB9.gV78ew7QUEM0EYyJvGWkOUA_FirHy9VptLBFVQsLl7o

// router.get('/protected',requireLogin,(req,res)=>{
//     res.send("Hello user")
// })

router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body
    if(!name || !email || !password)
    {
        return res.status(422).json({error:"Please enter all fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User already exists with that email. "})
        }
        bcrypt.hash(password,12) // More the higher number more secure it will be(default==10)
        .then(hashedpassword=>{
            const user = new User({
                name,
                email, // same meaning email:email
                password : hashedpassword,
                pic
            })
    
            user.save()
            .then(user=>{
                transporter.sendMail({
                    to:user.email,
                    from:"no-reply@insta.com",
                    subject:"Signup successfully",
                    html:"<h1>Welcome to Instagram</h1>"
                })
                res.json({message:"saved successfully"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
       
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"Please add email and password"})   
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password"})   
        }
        bcrypt.compare(password,savedUser.password)
        .then(domatch=>{
            if(domatch){
                // res.json({message:"Successfully signin"})
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET) //jwt.sign(payload, secretOrPrivateKey, [options, callback])
                const {_id,name,email,followers,following,pic} = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}}) //can write token
            }
            else{
                return res.status(422).json({error:"Invalid email or password"})   
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,Buffer)=>{
        if(err){
            console.log(err)
        }
        const token = Buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User do not exist with that mail"})
            }
            user.resetToken=token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"no-reply@insta.com",
                    subject:"Password reset",
                    html:`
                    <p>You requested for password reset</p>
                    <h5>Click on this link <a href="http:localhost/reset/${token}">link</a>to reset password</h5>
                    `
                })
                res.json({message:"Check your email"})
            })
        })
    })
})
module.exports = router