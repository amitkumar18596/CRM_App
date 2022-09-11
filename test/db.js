/**
 * This file will be used to initiate the connection with
 * mongodb memory server which we have installed as npm dependency
 */
const mongoose = require('mongoose')
const {MongoMemoryServer} = require('mongodb-memory-server')

let mongod //manages all the activities in mongodb
/**
 * Write code for connecting db
 */
module.exports.connect = async()=>{
    if(!mongod){
        mongod = await MongoMemoryServer.create() // create a running server
        const uri = mongod.getUri() // geturi will return URI of running mongoDB server
        const mongooseOpts = {
            useUnifiedTopology : true,
            maxPoolSize : 10
        }
        mongoose.connect(uri, mongooseOpts) // mongoose is now connected to mongoDB
    }
}

/**
 * Disconnectong DB and closing all the connection
 * 
 * whole testing is completed
 */
module.exports.closeDatabase = async()=>{
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()

    if(mongod){
        await mongod.stop()
    }
}

/**
 * Clear the db, remove all the records after testing is complete
 * 
 * when each individual test is completed
 */
module.exports.clearDatabase = ()=>{
    const collections = mongoose.connection.collections
    for (const key in collections){
        const collection = collections[key]
        collection.deleteMany()// delete all the documents in collections
    }
}