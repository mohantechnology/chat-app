const path = require('path');
const catchError = require('../middlewares/catchError');
const AppError = require("../utils/AppError");
const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const fs = require('fs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

/* import models */
const userAccount = require('../model/userAccount');
const chatMessage = require('../model/chatMessage');

const VEIW_DIR = path.resolve(__dirname + "/../views");

function cprint(varObj, dividerStr) {

    if (dividerStr !== undefined) {
        let myStr = "-";
        for (i = 0; i < 4; i++) {
            myStr += myStr
        }
        console.log(myStr)
    }
    console.log(Object.keys(varObj)[0]);
    console.log(Object.values(varObj)[0]);
}



 
// ######## List Chat Message  ########
module.exports.listMessage = catchError(async (req, res, next) => {

  
    // req.query.searchQuery = req.query.searchQuery ? req.query.searchQuery.trim() : undefined;
    const limit = req.query.limit && req.query.limit <= 5000 ? parseInt(req.query.limit) : 15;
    req.query.page = req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
    const skip = (req.query.page - 1) * req.query.limit ; 

    // let query = {
    //     $and: [
    //         { _id: req.user._id },
    //         { accessToken: req.user.accessToken }
    //     ]
    // } {uId : req.user.uId}

    let resultMessage = await chatMessage.find({uId : req.user.uId}, {}).skip(skip).limit(limit).sort({date: -1});

    // if (!resultAccount) {
    //     throw new AppError("User Account Not Exist", 404);
    // }

 
    return res.status(200).json({ message: "Messages are", data: resultMessage })


});