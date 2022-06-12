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
          if( result.friendList.length ){
            result.friendList =  await userAccount.find( 
                {uId: {$in :result.friendList }} ,
                {name:1, profileImg:1, profMess :1, uId:1 ,_id: 0  }
                )
          }
         
        cprint({ result })

        if (result.accountStatus !== 'active') { 
            return res.redirect("/active");
        }

        result.SOCKET_URL = process.env.SOCKET_URL;
        result.SOCKET_FILE = process.env.SOCKET_FILE;
        res.json(result)
        // return res.render("home", result);  
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


// ######## Get Profile Details  ########
module.exports.getProfileDetail = catchError(async (req, res, next) => {

    let query = {
        $and: [
            { _id: req.user._id },
            { accessToken: req.user.accessToken }
        ]
    } ; 
    let resultAccount = await userAccount.findOne(query, { _id: 0 , profileImg: 1  , profMess: 1 , accountType: 1 , messageTone: 1 , profMess: 1 });

    if (!resultAccount) {
        throw new AppError("User Account Not Exist", 404);
    }
  
    return res.status(200).json({ message: "Profile Details", data: resultAccount })
 
});



// ######## Update Profile Details  ########
module.exports.updateProfileDetail = catchError(async (req, res, next) => {

//   console.log( req.body )
//   console.log( "req.body" )

//   console.log( req.files )
//   console.log( "req.files" )



    let query = {
        $and: [
            { _id: req.user._id },
            { accessToken: req.user.accessToken }
        ]
    } ; 
    let inputData ={  } ; 
    // if ( req.body.profileImg ) inputData.profileImg =   req.body.profileImg ;   
    if ( req.body.profMess ) inputData.profMess =   req.body.profMess ;   
    if ( req.body.accountType ) inputData.accountType =   req.body.accountType ;   
    if ( req.body.messageTone ) inputData.messageTone =   req.body.messageTone ;   
 
  

    /* if request contain  profile image file then save the file   */
    if ( req.files && req.files.profileImg ){

        let profileImg = req.files.profileImg  ; 
        let extn = profileImg.name.split(".").pop().toLocaleLowerCase() ; 
 
        if (  profileImg.mimetype.split("/")[0] != 'image'){ 
            throw new AppError("File Not  Supported for Profile Image", 415 );
        }   
        else  if( !constant.ACCEPTABLE_IMAGE_EXT_lIST.includes(extn)   ) { 
            throw new AppError("Invalid File extension of Profile Image. Valid Extension are "+ constant.ACCEPTABLE_IMAGE_EXT_lIST.join(", ") , 415 ); 
        }
   
         let fileName =  "pf_" +     utilFunc.generateRandomBytes(25) +"."+ extn ;  
            await profileImg.mv(  __dirname + '/../public/upload/' + fileName) ; 
   
          /* add new file name to profile image   */
         inputData.profileImg = fileName ; 

    }

 

    /* update profile data     */
    let resultAccount = await userAccount.updateOne(query, { $set:inputData });
 
    /* if profile image is updated then remove previous profile image file and update profile image in cookie   */
     if(inputData.profileImg )  { 
        let prevProfileImg = req.user.profileImg ; 
        req.user.profileImg = inputData.profileImg  ; 
        let token = jwt.sign( req.user,  process.env.JWT_SECRET_KEY);
        res.cookie('sid', token, { expires: new Date(Date.now() + 6000000), httpOnly: true });
       
        if( fs.existsSync(  __dirname + '/../public/upload/'+  prevProfileImg  ) ) { 
         fs.rm(  __dirname + '/../public/upload/'+  prevProfileImg ,  ()=>{}) ; 
        
        } 
     }
   
    if (resultAccount.nModified != 1 ) {
        throw new AppError("Not Able to Update", 404);
    }
  
 
    return res.status(200).json({ message: "Profile Updated Successfully"  })
 
});

 