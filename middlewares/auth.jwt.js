const jwt = require('jsonwebtoken')
const authConfig = require('../configs/auth.config')
const User = require('../models/user.model')
const constants = require('../utils/constant')

const verifyToken = (req,res, next) =>{
    const token = req.headers['x-access-token']
    /**
     * check if token is present
     */
    if(!token){
        return res.status(403).send({
            message : 'No token provided. Access Prohibited'
        })
    }

    /**
     * Go and validate the token 
     */
    jwt.verify(token, authConfig.secret, (err, decoded)=>{
        if (err){
            return res.status(401).send({
                message :'Unauthorized'
            })
        }

        req.userId = decoded.id // we extracted the userid from token and store it req.userId
                                // when JWT validation successful,encrypted jwt token converted to intial payrol
        next()
    })

    /**
     * Read the value of the token ID and set it in the request for further use
     */
}

const isAdmin = async(req, res, next) =>{
    const user = await User.findOne({userId : req.userId})

    if(user && user.userType == constants.userTypes.admin) {
        next()
    }else{
        res.status(403).send({
            message : 'Only Admin users are allowed to fetch all users'
        })
    }
}

/**
 * First of all we will check userId provided in req param s valid or not then 
 * if valid we will check it is admin, owner or not
 */
const isValidUserIdInRequestParam = (req, res, next) =>{
    try{
        const user = User.find({userId : req.params.id})

        if(!user) {
            return res.status(400),send({
                message: "UserId doesn't exist"
            })
        }
        next()
    }catch(e){
        console.log('Error while reading teh user info', err.message)
        return res.status(500).send({
            message : 'Internal error while reading the user data'
        })
    }
}

const isAdminOrOwner = async(req, res, next) =>{
    /** 
     * Either the caller should be admin or caller should be owner
     */

     try{
        const callingUser = await User.findOne({userId : req.userId}) // get the user from Database

        if(callingUser.userType == constants.userTypes.admin || callingUser.userId == req.params.id){
            next()
        }else{
            res.status(403).send({
                message :'Only the owner or admin will be able to see the user'
            })
        }
            
    }catch(e){
        console.log('Error while reading teh user info', err.message)
        return res.status(500).send({
            message : 'Internal error while reading the user data'
        })
    }
}

const authJwt = {
    verifyToken : verifyToken,
    isAdmin : isAdmin,
    isAdminOrOwner : isAdminOrOwner,
    isValidUserIdInRequestParam : isValidUserIdInRequestParam
}

module.exports = authJwt