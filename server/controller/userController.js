const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../model/userModel')
const bcrypt = require('bcryptjs')

const registerUser = asyncHandler(async(req, res)=>{
    const {name, email, password} = req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error('Please fill the fields')
    }

    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400)
        throw new Error('User Already Exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create(
        {
            name,
            email,
            password : hashedPassword
        }
    )

    if(user){
        res.status(200).json({
            _id : user.id,
            name : user.name,
            email : user.email,
            token : generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error('Invalid User Data')
    }

})

const loginUser = asyncHandler(async(req, res)=>{
    const {email, password} = req.body

    const user = await User.findOne({email})

    if(user && await bcrypt.compare(password, user.password)){
        res.json({
            _id : user.id,
            name : user.name,
            email : user.email,
            token : generateToken(user._id)
        })
    }else {
        res.status(400)
        throw new Error('Invalid credentials')
      }
})

const getUser = asyncHandler(async(req, res)=>{
    res.status(200).json(req.user)
})


const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '2d'})
}

module.exports = {
    registerUser,
    loginUser,
    getUser
}