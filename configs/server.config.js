// Read from .env file and export to all other files

if(process.env.NODE_ENV !== 'production'){ // if it is not a production environment 
    require('dotenv').config()  // if the environment is not production , we dont need the dotenv module
}

module.exports = {
    PORT : process.env.PORT
}