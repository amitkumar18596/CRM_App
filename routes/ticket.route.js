/**
 * Route logic for thr ticket resource
 */
const ticketController = require('../controllers/ticket.controller')
const { authJwt } = require('../middlewares')

module.exports = (app) =>{
    /**
     * create a ticket
     * 
     *  POST /crm/api/v1/tickets
     */

    app.post('/crm/api/v1/tickets',[authJwt.verifyToken], ticketController.createTicket)

}