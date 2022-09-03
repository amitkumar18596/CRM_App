const User = require('../models/user.model')
const Ticket = require('../models/ticket.model')
const constants = require('../utils/constant')

const isValidOwnerOfTheTicket = async(req, res, next) =>{

    //get the user and ticket
    const user = await User.findOne({userId : req.userId})
    const ticket = await Ticket.findOne({_id : req.params.id})

    // if thr user is reporter , then he will be allowed to update the ticket
    if (user.userType == constants.userType.customer){
        const ownerId = ticket.reporter

        if (user.userId != ownerId){
            res.status(403).send({
                message : "Only ADMIN | OWNER | ENGINEER ASSIGNED is allowed" 
            })
        }
        
    }else if (user.userType == constants.userType.engineer){ // check if ticket is created by reporter or ticket is assigned to engineer
        const ownerId = ticket.reporter
        const engineerId = ticket.assignee

        if (user.userId != ownerId && user.userId != engineerId){
            
            return res.status(403).send({
                message : "Only ADMIN | OWNER | ENGINEER ASSIGNED is allowed"
            })
        }
    }

    /**
     * If the update requires the change in the assignee
     *  1. Only admin should be allowed to do this change
     *  2. Assignee should be a valid engineer
     */
    if (req.body.assignee != undefined && user.userType != constants.userType.admin){
        return res.status(403).send({
            message : "Only ADMIN  is allowed to reassign a ticket"
        })
    }

    if(req.body.assignee != undefined ){
        const engineer = await User.findOne({userId : req.body.assignee})
        if (engineer == null){
            return res.status(401).send({
            message : "Engineer userId passed as asignee is wrong"
        })
    }
    }

    next()
}

const verifyTicket = {
    isValidOwnerOfTheTicket : isValidOwnerOfTheTicket
}

module.exports = verifyTicket

