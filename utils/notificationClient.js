/**
 * This file shuld have the logic to connect to the notification service
 */

const Client = require('node-rest-client').Client

const client = new Client() //This is the client object which will be used for calling restAPIs

/**
 * Exposing a method which take request parameters for sending the 
 * notification request to notification services
 */

module.exports = (subject, content, recepients, requester) =>{
    /**
     * create the request  body
     */
    const reqBody = {
        subject : subject,
        recepientsEmails : recepients,
        content : content,
        requester : requester
    }

    /**
     * Prepare the headers
     */
    const reqHeader = {
        "Content-Type" : "application/json"
    }

    /**
     * combine headers and request body together
     */
    const args = {
        data : reqBody,
        headers : reqHeader
    }

    /** 
     * Make a POST call and handle  the resposne
     * 
     * URI should go in the .env file
     */
    try{
        client.post("http://localhost:8000/notiserve/api/v1/notifications", args, (data, res) =>{
            console.log("Request sent");
            console.log(data);
        })
    }catch(err){
        console.log(err.message);
    }
}
