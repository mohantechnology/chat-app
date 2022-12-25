 
const catchError = require('../middlewares/catchError');
const AppError = require("../utils/AppError");

/* import models */
const userAccount = require('../model/userAccount');

// ######## Get Video Page   ########
module.exports.videoPage = catchError(async (req, res) => {
  
  if( req.user.accountStatus != "active"){ 
    res.redirect("/active");
  }

  req.query.f_id = req.query.f_id ? req.query.f_id.trim(): undefined; 
  if (!req.query.f_id ) {
    throw new AppError("Must have field 'f_id'  ", 400);
  }

  /* find friend account details and also check if he  is friend or not */
  let query = { 
    $and  : [
      { uId:  req.query.f_id }, 
      { friendList:  req.user.uId }
    ]
  };
  let result = await userAccount.findOne(query, { name: 1, profileImg:1,profMess:1 ,uId:1  } );

  if (result) {
 
    result.SOCKET_URL = process.env.SOCKET_URL;
    result.SOCKET_FILE = process.env.SOCKET_FILE;
    result.accessToken = req.cookies.sid;
    if (result.profileImg && !result.profileImg.startsWith("https://")) {
      result.profileImg = "/upload/" + result.profileImg;
    }
 
    return res.render("video_chat", result);
  } else {
    throw new AppError("Invalid details of Friend ", 400);
  }

});
