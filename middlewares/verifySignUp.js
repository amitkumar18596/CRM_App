// This file will have the logic to validate the incoming requests
const User = require('../models/user.model')

validateSignUpRequestBody = async (req, res, next) =>{
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

    // validate if the usertype is present and valid
}