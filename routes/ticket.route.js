/**
 * Route logic for thr ticket resource
 */
const ticketController = require('../controllers/ticket.controller')
const { authJwt, validateTicket } = require('../middlewares')

module.exports = (app) =>{
    /**
     * create a ticket
     * 
     *  POST /crm/api/v1/tickets
     * 
     * Assignment : Add the middleware for the validation of the request body
     */

    app.post('/crm/api/v1/tickets',[authJwt.verifyToken], ticketController.createTicket)

    /**
     * GET /crm/api/v1/tickets
     */

    app.get('/crm/api/v1/tickets', [authJwt.verifyToken], ticketController.getAllTickets)

    /**
     * PUT /crm/api/v1/tickets/:id
     */
    app.put('/crm/api/v1/tickets/:id', [authJwt.verifyToken, validateTicket.isValidOwnerOfTheTicket], ticketController.updateTicket)
}