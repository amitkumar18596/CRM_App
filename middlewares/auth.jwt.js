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

        req.userId = decoded.id // when JWT validation successful,encrypted jwt token converted to intial payrol
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

const authJwt = {
    verifyToken : verifyToken,
    isAdmin : isAdmin
}

module.exports = authJwt