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