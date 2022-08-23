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

//update few attribute 
exports.update = async(req, res) =>{
    try{
        const user = await User.findOne({userId : req.params.id})
        user.userStatus = req.body.userStatus ? req.body.userStatus : user.userStatus
        user.name = req.body.name ? req.body.name : user.name
        user.userType = req.body.userType ? req.body.userType : user.userType
        const updatedUser = await user.save()
        res.status(200).send({
            name : updatedUser.name,
            userid : updatedUser.userId,
            email : updatedUser.email,
            userType : updatedUser.userType,
            userStatus : updatedUser.userStatus
        })
    }catch(e){
        console.log('Error while DB operation ', e.message)
        return res.status(500).send({
            message : 'Internal server error'
        })
    }
}