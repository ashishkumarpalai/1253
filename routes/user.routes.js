const express = require("express")
const { UserModel } = require("../model/user.model")
const jwt = require("jsonwebtoken")
const bcrypt=require("bcrypt")

const userRouter = express.Router()

userRouter.post("/register", async (req, res) => {
    const {name,email,pass} = req.body
    try {
        bcrypt.hash(pass, 5,async function(err, hash) {
            // Store hash in your password DB.
            if(err){
                res.send({ "msg": "something went wrong", "erroe": err.message })
            }else{
                const user = new UserModel({name,email,pass:hash})
                await user.save()
                res.send({ "msg": "new user has been register" })
            }
        });
        
    } catch (err) {
        res.send({ "msg": "something went wrong", "erroe": err.message })
    }

})

userRouter.post("/login", async (req, res) => {
    const { email,pass} = req.body
    try {
        const user = await UserModel.find({ email })
        if (user.length > 0) {
            bcrypt.compare(pass, user[0].pass, function(err, result) {
                if(result){
                    let token=jwt.sign({userID:user[0]._id},"masai")
                    res.send({ "msg": "Logged in", "token": token })
                }else{
                    res.send({ "msg": "Wrong Creadential" })
                }
            });
            
        } else {
            res.send({ "msg": "Wrong Creadential" })
        }
    } catch (err) {
        res.send({ "msg": "something went wrong", "erroe": err.message })
    }

})

module.exports = {
    userRouter
}