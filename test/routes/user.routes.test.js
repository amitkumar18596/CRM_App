/**
 * This file is going to contain the logic for the integration 
 * testing for user.route.js
 */
const db = require('../db')
const jwt = require('jsonwebtoken')
const User = require('../../models/user.model')
const config = require('../../configs/auth.config')
const request = require('supertest')
const app = require('../../server')

/**
 * This will be used for intialize the setup
 */
let token
beforeAll(async()=>{
    
    // Generating the token to be used for sending the request for Auth
    token = jwt.sign({id : "admin"}, config.secret, {
        expiresIn : 120
    })
    /**
     * Insert the data inside test DB
     */
    await db.clearDatabase() //make sure DB is clrea before inserting data to DB
    await User.create({
        name : "Amit",
        userId : "admin",
        email : "maharana.amit@gmail.com",
        userType : "ADMIN",
        userStatus : "APPROVED",
        password : "Welcome1"
    })
})

/**
 * Cleanup the project when everything is completed
 */
afterAll(async()=>{
    await db.clearDatabase()
})

/**
 * Integration testing for all the usersend point /crm/api/v1/users
 */

describe("find all users", ()=>{
    it("find all the users", async()=>{
        /**
         * 1. We need to have some data in DB || This is done in beforeAll() method
         * 2. Generate the token using the same logic and use for the test
         */
        

        // Need to invoke the API  -- We need to make use of supertest
        const res = await request(app).get('/crm/api/v1/users').set('x-access-token', token)

        //code for the validation
        expect(res.statusCode).toEqual(200)
        // expect(res.body).toEqual(
        //     expect.arrayContaining([
        //         expect.objectContaining({
        //             name : 'Amit',
        //             userId : 'admin',
        //             email : 'maharana.amit@gmail.com',
        //             userType : 'ADMIN',
        //             userStatus : 'APPROVED'
        //         })
        //     ])
        // )
    })
})

describe("Find user based on userId", ()=>{
    it("test the end point /crm/api/v1/users/:id", async()=>{
        //Execution of the code
        const res = await request(app).get("/crm/api/v1/users/admin").set("x-access-token", token)

        //Validation of code
        expect(res.statusCode).toEqual(200)
        // expect(res.body).toEqual(
        //     expect.arrayContaining([
        //         expect.objectContaining({
        //             name : 'Amit',
        //             userId : 'admin',
        //             email : 'maharana.amit@gmail.com',
        //             userType : 'ADMIN',
        //             userStatus : 'APPROVED'
        //         })
        //     ])
        // )
    })
})