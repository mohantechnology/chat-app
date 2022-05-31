const express = require('express');
const chatRoutes = express.Router();
// const account = require('../controllers/account');

chatRoutes.get("/chat",   (req, res,next)=>{
    res.send("connected----------s**>" + "get") ; 
    
});



module.exports = chatRoutes;