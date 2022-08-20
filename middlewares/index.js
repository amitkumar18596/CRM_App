const verifySignUp = require('./verifySignUp')
const authJwt = require('./auth.jwt')
/**Ican add mpre middlewares as projects grows */

module.exports = {
    verifySignUp,
    authJwt
}