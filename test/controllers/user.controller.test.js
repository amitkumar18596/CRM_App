/**
 * This file will contain unit testing for all the methods f user controller
 */

/**
 * Let's try to test the method findAll()
 * 
 *  -happy path test
 *  -test based on query param
 *  -Negative scenario
 */
//const jest = require('jest')
const {findAll} = require('../../controllers/user.controller')
const User = require('../../models/user.model')
const {mockRequest, mockResponse} = require('../intercepter')

const userTestPayload = {
    name : "Test",
    userId : "Test01",
    email : "test@gmail.com",
    userType : "CUSTOMER",
    userStatus : "APPROVED",
    ticketsCreated : [],
    ticketsAssigned : []
}

describe("Test findAll method", ()=>{

    it("test the scenario when no query param is passed", async()=>{
        /**
         * First we are doing the set up for the project
         */
        /**
         * Mock the User.find() method
         */
        const userSpy = jest.spyOn(User, 'find').mockReturnValue(Promise.resolve([userTestPayload]))

        /**
         * Mock req and res objects
         */
        const req = mockRequest()
        const res = mockResponse()

        req.query = {} // We need to provide the mock implementation

        /**
         * Actual Execution
         */

        await findAll(req,res)

        /**
         * Assertions
         */

        // I need to verify that userSpy was called in execution
        expect(userSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    name : "Test"
                })
            ])
        )
    })

    it("Test the scenario when user statys is passed in query param", async()=>{
        /**
         * Mock the User.find() method
         */
         const userSpy = jest.spyOn(User, 'find').mockReturnValue(Promise.resolve([userTestPayload]))

         /**
          * Mock req and res objects
          */
         const req = mockRequest()
         const res = mockResponse()

         const query = {userStatus : "APPROVED"}

         /**
         * Actual Execution
         */

        await findAll(req,res)

        expect(userSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    userStatus : "APPROVED"
                })
            ])
        )
    })

    /**
     * Test one negative or error case
     */

    /**
     * Mock the error scenario
     */

    it("Error while calling the User.find() method", async()=>{
        const userSpy = jest.spyOn(User, 'find').mockReturnValue(Promise.reject(new Error(("error"))))

        /**
          * Mock req and res objects
          */
         const req = mockRequest()
         const res = mockResponse()
         req.query = ({userStatus : "APPROVED"})

        await findAll(req,res)
        expect(userSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({
            message : "Internal server Error"
        })
    })
})

/**
 * Test case for update scenario
 */
