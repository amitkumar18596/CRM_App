// This file will have the logic to validate the incoming requests
const User = require('../models/user.model')
const constants = require('../utils/constant')

const validateSignUpRequestBody = async (req, res, next) =>{
    // validate if name is present
    if (!req.body.name){
        return res.status(400).send({
            message : 'user name is not provided'
        })
    }

    // Validate if userid is present and it's not duplicate
    if (!req.body.userId){
        return res.status(400).send({
            message : 'userId is not provided'
        })
    }
    try{
        const user = await User.findOne({userId : req.body.userId})
        if (user != null){
            return res.status(400).send({
                message : 'Failed : userID is already taken'
            })
        }
    }catch(e){
        return res.status(500).send({
            message : 'Internal server error while validating the request'
        })
    }

    // validate if password us present or not
    /*
    logic to do extra validations
    1. it should be f min length 10
    2. Alphabet, numeric, special character atleast one
     */
    if (!req.body.password){
        return res.status(400).send({
            message : 'Password is not provided'
        })
    }

    // validate if emailid is present and it's not duplicate
    if (!req.body.email){
        return res.status(400).send({
            message : 'email is not provided'
        })
    }

    if (!isValidEmail (req.body.email)) {
        return res.status(400).send({
            message : 'email is not valid at a;;'
        })
    }

    

    // validate if the usertype is present and valid
    if(!req.body.userType){
        return res.status(400).send({
            message : 'userType is not provided'
        })
    }

    if (req.body.userType == constants.userTypes.admin){
        return res.status(400).send({
            message : 'Admin can not be passed'
        })
    }

    const userTypes = [constants.userTypes.engineer, constants.userTypes.customer]
    if(!userTypes.includes(req.body.userType)){
        return res.status(400).send({
            message : 'Usertype provided is not correct. Possible correct values are : Customer, Engineer'
        })
    }

    next() // give controlto next middleware
}

const isValidEmail = (email) =>{
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}

const validateSignInRequestBody = (req, res, next) =>{
    // Validate if userid is given
    if (!req.body.userId){
        return res.status(400).send({
            message : 'userId is not provided'
        })
    }

    // Validate if password is given
    if (!req.body.password){
        return res.status(400).send({
            message : 'Password is not provided'
        })
    }

    next()
}

const verifyRequestBodyForAuth = {
    validateSignUpRequestBody : validateSignUpRequestBody,
    validateSignInRequestBody : validateSignInRequestBody
}

module.exports = verifyRequestBodyForAuth