

/* This file will contain logic for registration of user 
User :

Customer :
    1. Registration and approved by default
    2. should be able to login immediately

Engineer : 
    1. Should be able to be registered
    2. initially he will be in PENDING state
    3. ADMIN should be able to approve

Admin :
    1. ADMIN user should be only created from backend not from API

*/

const bcrypt = require('bcrypt')
const User = require('../models/user.model')
const jwt = require ('jsonwebtoken')
const authConfig = require('../configs/auth.config')
const constants = require('../utils/constant')

/*
Logic to accept the registation login/sign up

req ->what we get from client
res -> what we retrn from server
*/

exports.signup = async (req, res)=>{
    // I need to read data from the request body
    if(req.body.userType != constants.userTypes.customer){
        req.body.userStatus = constants.userStatus.pending
    }

    // convert that into JS object for inserting mongo DB
    const userObj = {
        name : req.body.name,
        userId : req.body.userId,
        email : req.body.email,
        userType : req.body.userType,
        password : bcrypt.hashSync(req.body.password, 8), // password to be encrypted
        userStatus : req.body.userStatus
    }

    // insert the data and return the response
    try{
        const userCreated = await User.create(userObj)
        // we need to return newly created user as the response, 
        // we should some sensitive details like password, __v
        // We need to create custom response and return
        const response = {
            name : userCreated.name,
            userId : userCreated.userId,
            email : userCreated.email,
            userType : userCreated.userType,
            userStatus : userCreated.userStatus,
            createdAt : userCreated.createdAt,
            updatedAt : userCreated.updatedAt
        }
        res.status(201).send(response)
    }catch(e){
        console.log('Some error happened ', e.message);
        res.status(500).send({
            message : 'Internal server Error'
        })
    }
    
}

// logic for sign in
exports.signin = async (req, res)=>{
    try{
    // if userid passed is correct
    const user = await User.findOne({userId : req.body.userId})
    if(user == null){
        res.status(400).send({
            message : 'UserID passed doesnot exist'
        })
    }

    // password passed is correct
    const passwordIsValid = await bcrypt.compareSync(req.body.password, user.password)
    if (!passwordIsValid){
        return res.status(401).send({
            message : 'Wrong Password'
        })
    }

    // create JWT token
    const token = jwt.sign({
        id : user.userId
    }, authConfig.secret , {
        expiresIn : 600
    })

    // send the successful login response
    res.status(200).send({
        name : user.name,
        userId : user.userId,
        email : user.email,
        userType : user.userType,
        userStatus : user.userStatus,
        accessToken : token
    })
}catch(e){
    console.log('internal error', e.message);
}
}