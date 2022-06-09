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






module.exports.homePage = catchError(async (req, res, next) => {
    console.log("register get ")
    console.log(" req.user");
    console.log(req.user);
    let outFilter = { __v: 0, password: 0, files: 0 }
    let result = await userAccount.findOne({ $and: [{ _id: req.user._id }, { accessToken: req.user.accessToken }] }).lean();
    if (result) {
        cprint({ result })

        if (result.accountStatus !== 'active') { 
            return res.redirect("/active");
        }

        result.SOCKET_URL = process.env.SOCKET_URL;
        result.SOCKET_FILE = process.env.SOCKET_FILE;
        return res.render("home", result);  
    } else { 
        res.redirect("/login");
    }

})

 

// ######## List All Notification  ########
module.exports.listNotification = catchError(async (req, res, next) => {

  

    let query = {
        $and: [
            { _id: req.user._id },
            { accessToken: req.user.accessToken }
        ]
    }

    let resultAccount = await userAccount.findOne(query, { notification: 1 });

    if (!resultAccount) {
        throw new AppError("User Account Not Exist", 404);
    }

 
    return res.status(200).json({ message: "Notifications are", data: resultAccount.notification })


});