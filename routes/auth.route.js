/*
This file will contain the logic for routing request

This file is dedicated to the routing logic for sign up and sign in
*/

const authController = require('../controllers/auth.controller')
const { verifySignUp } = require('../middlewares') // bydefault it will go index.js
module.exports = (app) =>{
    // POST crm/api/v1/auth/signup
    app.post('/crm/api/v1/auth/signup',[verifySignUp.validateSignUpRequestBody], authController.signup)

    //Login 
    // POST crm/api/v1/auth/signin
    app.post('/crm/api/v1/auth/signin',[verifySignUp.validateSignInRequestBody], authController.signin)
}