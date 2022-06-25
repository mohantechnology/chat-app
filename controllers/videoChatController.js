const path = require('path');
const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const fs = require('fs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const catchError = require('../middlewares/catchError');
const AppError = require("../utils/AppError");
const constant = require("../utils/constant");

/* import models */
const userAccount = require('../model/userAccount');
const utilFunc = require('../utils/utilFunc');
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





// ######## Get Video Page   ########
module.exports.videoPage = catchError(async (req, res, next) => {
    // console.log("register get ")
    // console.log(" req.user");
    // console.log(req.user);

    // console.log(" req.query")
    // ;
    // console.log(req.query);


    
    if( req.user.accountStatus != "active"){ 
        res.redirect("/active")
    }



      req.query.f_id = req.query.f_id ? req.query.f_id.trim(): undefined; 
     if (!req.query.f_id ) {
        throw new AppError("Must have field 'f_id'  ", 400)
     }


    /* find friend account details and also check if he  is friend or not */
     let query = { 
        $and  : [
            { uId:  req.query.f_id }, 
            { friendList:  req.user.uId }
        ]
     }
    let result = await userAccount.findOne(query, { name: 1, profileImg:1,profMess:1,profileImg:1,uId:1  } );

    if (result) {
 
        result.SOCKET_URL = process.env.SOCKET_URL;
        result.SOCKET_FILE = process.env.SOCKET_FILE;
        result.accessToken = req.cookies.sid;
        if (result.profileImg && !result.profileImg.startsWith("https://")) {
            result.profileImg = "/upload/" + result.profileImg;
        }
        // // res.json(result)
        // console.log( result);  
        // console.log( "result");  
        return res.render("video_chat", result);
    } else {
        throw new AppError("Invalid details of Friend ", 400)
    }

})


 

 