// mongodb connection

const mongoose = require('mongoose')
require('dotenv').config();

exports.dbConnection = () => {
    mongoose.connect()
    .then( () => {
        console.log("db connection successful");
    })
    .catch((error) => {
        console.log("db connection failed");
        console.error(error);
        process.exit(1);
    })
}