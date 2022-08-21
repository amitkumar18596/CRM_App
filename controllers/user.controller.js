/**
 * This is controller file for user resource
 */
const User = require('../models/user.model')
const ObjectConverter = require('../utils/objectConverter')

/**
 * Get the list of all the users
 */
exports.findAll = async (req, res) =>{

    const queryObj = {}

    /**
     * Reading the optional query params
     */
    const userTypeQP = req.query.userType
    const userStatusQP = req.query.userStatus

    if (userTypeQP){
        queryObj.userType = userTypeQP
    }

    if (userStatusQP) {
        queryObj.userStatus = userStatusQP
    }

    try{
        const users = await User.find(queryObj)

        res.status(200).send(ObjectConverter.userResponse(users)) //
    }catch(e){
        console.log('Error while fetchong all the users');
        res.status(500).send({
            message : 'Internal server Error'
        })
    }
}

/**
 * This method will return the user details based on the id
 */
exports.findByUserID = async(req, res) =>{
    try{
        const user = await User.find({userId : req.params.id}) // it will return an array
        // user validation would have happened in moddleware itself
        return res.status(200).send(ObjectConverter.userResponse(user))
    }catch(err){
        console.log('Error while searching the user',err);
        return res.status(500).send({
            message : 'Internal server error'
        })
    }


}