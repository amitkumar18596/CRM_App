// This is the starting point of application

const express = require('express')
const app = express()
const serverConfig = require('./configs/server.config')
const bodyParser = require ('body-parser')
const mongoose = require('mongoose')
const dbConfig = require('./configs/db.config')
const User = require('./models/user.model')
const bcrypt = require('bcrypt')

// Register the body parser middlewire
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

// initialize the connection to mongoDB
mongoose.connect(dbConfig.DB_URL)
const db = mongoose.connection
db.on('error',() =>{ // On will listen to error event 
    console.log('Error while connection to MongoDB');
})
db.once('open', ()=>{ // once will listen to success event
    console.log('Connected to mongoDB');
    init()
})

// create ADMIN user at boot time
async function init(){
    // check if admin user is already present
    try{
        let user = await User.findOne({userId : 'admin'})

    if (user){
        console.log('ADMIN user is already present');
        return;
    }

    user = await User.create({
        name : 'Amit',
        userId : 'admin',
        password : bcrypt.hashSync('Welcome1', 8),
        email : 'maharana.amit@gmail.com',
        userType : 'ADMIN'
    })

    console.log(user);
    }catch(err){
        console.log('error in db initialization ' , err.message);
        
    }
}

// We need to connect router to server
require('./routes/auth.route')(app) // This registers auth with routr
require('./routes/user.route')(app)
require('./routes/ticket.route')(app)

app.listen(serverConfig.PORT, () =>{
    console.log('App is running on port ', serverConfig.PORT);
})