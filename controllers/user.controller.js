/**
 * This is controller file for user resource
 */
const User = require('../models/user.model')
const ObjectConverter = require('../utils/objectConverter')

/**
 * Get the list of all the users
 */
exports.findAll = async (req, res) =>{
    try{
        const users = await User.find()

        res.status(200).send(ObjectConverter.userResponse(users)) //
    }catch(e){
        console.log('Error while fetchong all the users');
        res.status(500).send({
            message : 'Internal server Error'
        })
    }
}