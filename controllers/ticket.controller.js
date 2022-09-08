/**
 * This file should have the logic to create controller for ticket resource
 */

/**
 * Method to create the logic of creating tickets
 * 
 * 1. Any authenticated user should should be able to create the tickets
 *          -- middleware should be able to take care of this
 * 
 * 2. Ensure that request body has valid data 
 *          -- middleware
 * 
 * 3. After the ticket is ctrated, ensurethe engineer and customer documents are also updated
 * 
 * 4. Send the email after ticket is created to all the stake holders
 * 
 */
const constants = require('../utils/constant')
const Ticket = require('../models/ticket.model')
const User = require('../models/user.model')
const sendNotificationReq = require('../utils/notificationClient')

exports.createTicket = async (req, res)=>{
    try{
        /**
     * read from the request body and create the ticket object
     */
    const ticketObj = {
        title : req.body.title,
        ticketPriority : req.body.ticketPriority,
        description : req.body.description,
        status : req.body.status,
        reporter : req.userId // I will get it from access token
    }

    /**
     * Find the engineer available and attach to the ticket object
     * 
     * 
     * Assignments : Extend this to chhose the engineer who has least number ticket
     */
    const engineer = await User.findOne({
        userType : constants.userType.engineer,
        userStatus : constants.userStatus.approved
    })

    if (engineer){
        ticketObj.assignee = engineer.userId
    }

    /**
     * insert the ticket object 
     *  - insert that ticket id in customer and engineer document
     */
    const ticketCreated = await Ticket.create(ticketObj)

    if (ticketCreated){
        // update the customer document
        const customer = await User.findOne({
            userId : req.userId
        })

        customer.ticketsCreated.push(ticketCreated._id)
        await customer.save()

        // Update the engineer document
        if(engineer){
            engineer.ticketsAssigned.push(ticketCreated._id)
            await engineer.save()
        }

        // Now we should send the notification req to ntification service
        sendNotificationReq(`Ticket created with id : ${ticketCreated._id}`, "Ticket created", `${customer.email}, ${engineer.email}, maharana.amit@gmail.com`, 'CRM APP')

        res.status(201).send(ticketCreated)

    }

    }catch (e){
        console.log('Error while doing the DB operation', e.message);
        res.status(500).send({
            message : 'internal server error'
        })
    }
    
}

/**
 * Getting all the tickets
 */

exports.getAllTickets = async(req, res) =>{
    /**
     * We need to find the userType 
     * and depending upon userType we need to frame the search query
     */
    const user = await User.findOne({userId : req.userId})
    const queryObj = {}
    const ticketsCreated = user.ticketsCreated // This is an array of ticket_id
    const ticketsAssigned = user.ticketsAssigned

    if(user.userType == constants.userType.customer){
        /**
         * query for fetching for all the tickets created by the user
         */

        if(!ticketsCreated){
            return res.status(200).send({
                message : "No tickets created by user yet"
            })
        }
        queryObj["_id"] = { $in : ticketsCreated}

        //console.log(queryObj);

    }else if(user.userType == constants.userType.engineer){
        /**
         * Query object for fetching all the tickets assigned/created to a user
         */

        queryObj["$or"] = [{"_id" : { $in : ticketsCreated}}, {"_id" : { $in : ticketsAssigned}}]

        //console.log(queryObj);
    }

    const tickets = await Ticket.find(queryObj)

    res.status(200).send(tickets)
}

/**
 * Write controller function to updating tickets
 */

exports.updateTicket = async(req, res) =>{
    try{
        const ticket = await Ticket.findOne({"_id" : req.params.id})

    /**
     * Update the ticket object based on the request body passed
     */
    ticket.title = req.body.title != undefined ? req.body.title : ticket.title
    ticket.description = req.body.description != undefined ? req.body.description : ticket.description
    ticket.ticketPriority = req.body.ticketPriority != undefined ? req.body.ticketPriority : ticket.ticketPriority
    ticket.status = req.body.status != undefined ? req.body.status : ticket.status
    ticket.assignee = req.body.assignee != undefined ? req.body.assignee : ticket.assignee

    const updatedTicket = await ticket.save()
    res.status(201).send(updatedTicket)

    }catch(e){
        res.status(400).send({
            message : 'Internal server error'
        })
    }
}