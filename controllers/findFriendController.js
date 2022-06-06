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






module.exports.findFriendPage = catchError(async (req, res, next) => {
    console.log("register get ")
    console.log(" req.user");
    console.log(req.user);

    return res.render("find_friend");


})


//catchError

module.exports.searchFriend = catchError(async (req, res, next) => {

    // console.log( "createUserAccount")
    console.log("req.query")
    console.log(req.query)
    // console.log(  await userAccount.deleteMany())
    // throw new AppError( "my message",500, "validation")
    //   console.log( await userAccount.collection.drop() ) 

    req.query.searchQuery = req.query.searchQuery ? req.query.searchQuery.trim() : undefined;
    const limit = req.query.limit && req.query.limit < 5000 ? parseInt(req.query.limit) : 15;
    req.query.page = req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
    const skip = (req.query.page - 1) * req.query.limit

    if (!req.query.searchQuery) {
        throw new AppError("Must have some character to search", 400)
    }

    let resultAccount = await userAccount.findOne({ email: req.user.email, accessToken: req.user.accessToken } ,{sendedRequest:1  , friendList:1});
  
    if( !resultAccount){
        throw new AppError( "User Account Not Exist", 404) ; 
    }

    //  create  set  of userid   for users that are already  friends
    let friendListSet = new Set(resultAccount.friendList) ; 

   //  create  set  of userid   for those  users  whom friend request are already sended 
    let sendedRequestSet = new Set(resultAccount.sendedRequestSet) ; 
 
    let outFilter = { uId: 1, name: 1, email: 1 } ; 

    let query = {
        $and: [
            {
                $or: [
                    { name: new RegExp(req.query.searchQuery, "i") },
                    { email: new RegExp(req.query.searchQuery, "i") },
                ]
            },
             {_id: {$ne:resultAccount._id}} , 
            { accountType: "public" }
        ]
    }

     let resultSearch = await userAccount.find( query  , outFilter).skip(skip).limit(limit).lean();

   
     for ( let i=0; i<resultSearch.length ; i++ ){ 
        resultSearch[i].isFriend = friendListSet.has(resultSearch[i]._id) ?true : false; 
        resultSearch[i].sendedRequestSet = sendedRequestSet.has(resultSearch[i]._id) ?true : false; 
     }

        console.log("resultSearch")
    console.log(resultSearch)
   

    return res.status(200).json({ message: "friend list are", list: resultSearch })


    });





