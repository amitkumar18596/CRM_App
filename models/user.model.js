const mongoose = require('mongoose')
const constants = require('../utils/constant')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    userId : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    email :{
        type : String,
        required : true,
        lowercase : true,
        minLength : 10,
        unique : true
    },
    createdAt : {
        type : Date,
        immutable : true,
        default : () =>{
            return Date.now()
        }
    },
    updatedAt : {
        type : Date,
        default : () =>{
            return Date.now()
        }
    },
    userType : {
        type : String,
        required : true,
        default : constants.userType.customer,
        enum : [constants.userType.customer, constants.userType.admin, constants.userType.engineer]
        // eum is used when a variable has fixed amount of values
    },
    userStatus : {
        type : String,
        required : true,
        default : constants.userStatus.approved,
        enum : [constants.userStatus.approved, constants.userStatus.pending, constants.userStatus.rejected]
    }
})

module.exports = mongoose.model('user', userSchema)