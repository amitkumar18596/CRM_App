const verifySignUp = require('./verifySignUp')
const authJwt = require('./auth.jwt')
const validateTicket = require('./ticketValidator')
/**Ican add mpre middlewares as projects grows */

module.exports = {
    verifySignUp,
    authJwt,
    validateTicket
}