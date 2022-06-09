// require('dotenv').config();
const mongoose = require("mongoose");
const fs = require('fs');

const DatabaseSetup = () => {
    const DB_LINK = process.env.DB_LINK;

    let options = {
        retryWrites: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false, 
        w: "majority",
    };



    mongoose.connect(DB_LINK, options)
        .then(conn => {
            console.log("Connection to database sucessful");
        })
        .catch(err => {

            // console.log("Failed to Connect with database");
            // console.log(err);
            setTimeout(()=>{
            console.log("Retrying to connect with database.....");
            DatabaseSetup()
            },3000)
          
        })
}
module.exports = DatabaseSetup;