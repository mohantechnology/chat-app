const path = require('path');
const catchError = require('../middlewares/catchError');
const AppError = require("../utils/AppError");
const utilFunc = require("../utils/utilFunc");
const constant = require("../utils/constant");
const crypto = require("crypto");
const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const axios = require('axios'); 

/* import models */
const userAccount = require('../model/userAccount');
const accountVerfication = require('../model/accountVerfication');

const VEIW_DIR = path.resolve(__dirname + "/../views");

module.exports.logout = catchError( async(req, res) => {
  res.cookie('sid', "", { expires: 0,  });
  let query = {$and : [ { email: req.user.email ,accessToken : req.user.accessToken  }]};
  
  await userAccount.updateOne(query,   {  currentStatus:"offline" , accessToken: "tk" + crypto.randomBytes(10).toString('hex') })  ; 
  return res.status(200).json({ message: "Logout Successfully" });

});

module.exports.registerPage = (req, res) => {
  res.sendFile(VEIW_DIR + "/reg.html");
};

module.exports.loginPage = (req, res) => {
  let  data ={
    GOOGLE_CLIENT_Id : process.env.GOOGLE_CLIENT_Id ,
    FACEBOOK_APP_Id : process.env.FACEBOOK_APP_Id ,
        
  };
  res.render("login.hbs" ,data );
};
module.exports.landingPage = (req, res) => {
  res.redirect("/login");
};

module.exports.activateAccountPage = (req, res) => {
  res.sendFile(VEIW_DIR + "/activate.html");
};

module.exports.verifyOTPPage = (req, res) => {
  res.sendFile(VEIW_DIR + "/reset_pass_with_num.html");
};
module.exports.forgotPasswordPage = (req, res) => {
  res.sendFile(VEIW_DIR + "/forgot.html");
};

module.exports.updatePasswordPage = (req, res) => {
  res.sendFile(VEIW_DIR + "/reset.html");
};

//  function to set credentiaals in cookie
function setCredentialsToCookies(res,accountDetail){

  let token = jwt.sign(
    {
      email: accountDetail.email,
      accessToken: accountDetail.accessToken,
      accountStatus: accountDetail.accountStatus, 
      _id: accountDetail._id,
      uId: accountDetail.uId,
      name: accountDetail.name,
      profMess: accountDetail.profMess,
      profileImg: accountDetail.profileImg, 
            
    },
    process.env.JWT_SECRET_KEY);

  res.cookie('sid', token, { expires: new Date(Date.now() + constant.USER_SESSION_EXPIRE_TIME), httpOnly: false  ,sameSite: 'none', secure: true} );
  res.cookie('lid', token, { expires: new Date(Date.now() + constant.USER_SESSION_EXPIRE_TIME), httpOnly: true } );
  return token ; 
    
}
module.exports.loginUserAccount = catchError(async (req, res) => {

  req.body.email = req.body.email ? req.body.email.trim() : undefined;
  req.body.password = req.body.password ? req.body.password.trim() : undefined;

  if (!req.body.email || !req.body.password) {
    throw new AppError("Must have field 'email', 'password' ", 400);
  }

  let accessToken = "tk" + crypto.randomBytes(10).toString('hex');
  let tokenExpireAt = (new Date(Date.now() + constant.USER_SESSION_EXPIRE_TIME )).getTime();
  let result = await userAccount.findOneAndUpdate({ email: req.body.email }, { accessToken, tokenExpireAt , currentStatus:"online" }, { new: true }).lean();
 
  if (result) {
    if (await bcrypt.compare(req.body.password, result.password)) {
      // save  data to jwt token

      result.accessToken  = accessToken ;  
            
      let token  =  setCredentialsToCookies( res,result ) ; 
      let resData = { message:  "verfiy successfully", accessToken:token} ; 
      if( req.body.data== "yes"){
        resData.data = result;
      }
      return res.status(200).json(resData) ; 
    }
    else {
      return res.status(401 ).json({ message: "Invalid Credentials" });
    }

  }
  return res.status(401 ).json({ message: "Invalid Credentials" });

});

module.exports.deleteUserAccount = catchError(async (req, res) => {

  req.body.email = req.body.email ? req.body.email.trim() : undefined;
 
  if (!req.body.email ) {
    throw new AppError("Must have field 'email' ", 400);
  }
 
  await userAccount.deleteMany({ email: req.body.email });

  return res.status(200).json({ message: "Account Delete Successfully" });

});

module.exports.loginWithGoogleAccount = catchError(async (req, res) => {
  // https://oauth2.googleapis.com/tokeninfo?id_token={{your_token}}

  req.body.credential = req.body.credential ? req.body.credential.trim() : undefined;

  if (!req.body.credential) {
    throw new AppError("Must have field 'credential'", 400);
  }
  // verfiy token and get user details
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_Id);
  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_CLIENT_Id,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
  }
  catch (err) {
    throw new AppError("Verfication Failed", 400);
  }

  // find if any account already exist matching this email  
  let resultAccount = await userAccount.findOne({ email: ticket.payload.email }).lean();
  if (!resultAccount) {
    // if account  not exist then create it 
    let userData = {
      name: ticket.payload.name,
      profileImg: ticket.payload.picture,
      email: ticket.payload.email,
      accountType: "public",
      accountStatus: "active",
      uId: "cz" + crypto.randomBytes(10).toString('hex'),
      password: crypto.randomBytes(20).toString('hex'),
      accessToken: "tk" + crypto.randomBytes(10).toString('hex'),
      tokenExpireAt: (new Date(Date.now() + constant.USER_SESSION_EXPIRE_TIME)).getTime(),
      currentStatus: "online",
    };
    resultAccount = await userAccount.create(userData);

  }
  else {
    // else use already created account to login 
    let accessToken = "tk" + crypto.randomBytes(10).toString('hex');
    let tokenExpireAt = (new Date(Date.now() + constant.USER_SESSION_EXPIRE_TIME)).getTime();
    let result = await userAccount.updateOne({ email: ticket.payload.email }, { accessToken, tokenExpireAt, currentStatus: "online" });
 
    if (result.nModified != 1) {
      throw new AppError("Something Went Wrong", 500);
    }
    resultAccount.accessToken = accessToken;
    resultAccount.tokenExpireAt = tokenExpireAt;

  }
  setCredentialsToCookies(res, resultAccount);

  return res.status(200).json({ message: "verfiy successfully", data: resultAccount });

});

module.exports.loginWithFaceBookAccount = catchError(async (req, res) => {
 
  req.body.accessToken = req.body.accessToken ? req.body.accessToken.trim() : undefined;

  if (!req.body.accessToken) {
    throw new AppError("Must have field 'accessToken'", 400);
  }
  // verfiy token and get user details
 
  let ticket;
  try {

    let response = await axios({
      method: 'GET',
      url: "https://graph.facebook.com/me?access_token="+req.body.accessToken  , 
    });    
    ticket = response.data ; 
    // ticket  
  }
  catch (err) {
    throw new AppError("Verfication Failed", 400);
  }

  // find if any account already exist matching this email  
  let resultAccount = await userAccount.findOne({ facebookId: ticket.id }).lean();
 
  if (!resultAccount) {
    // if account  not exist then create it 
    let userData = {
      name: ticket.name,
      profileImg: `https://graph.facebook.com/${ticket.id}/picture?type=large`,
      email: "fb_" + crypto.randomBytes(5).toString('hex')+ "@fb.com",  //  add any  random email  
      facebookId: ticket.id,                     // store facebook Id
      accountType: "public",
      accountStatus: "active",
      uId: "cz" + crypto.randomBytes(10).toString('hex'),
      password: crypto.randomBytes(20).toString('hex'),
      accessToken: "tk" + crypto.randomBytes(10).toString('hex'),
      tokenExpireAt: (new Date(Date.now() + constant.USER_SESSION_EXPIRE_TIME)).getTime(),
      currentStatus: "online",
    };
    resultAccount = await userAccount.create(userData);

  }
  else {
    // else use already created account to login 
    let accessToken = "tk" + crypto.randomBytes(10).toString('hex');
    let tokenExpireAt = (new Date(Date.now() + constant.USER_SESSION_EXPIRE_TIME)).getTime();
    let result = await userAccount.updateOne({ facebookId: ticket.id}, { accessToken, tokenExpireAt, currentStatus: "online" });
 
    if (result.nModified != 1) {
      throw new AppError("Something Went Wrong", 500);
    }
    resultAccount.accessToken = accessToken;
    resultAccount.tokenExpireAt = tokenExpireAt;

  }
 
  setCredentialsToCookies(res, resultAccount);

  return res.status(200).json({ message: "verfiy successfully", data: resultAccount });

});

module.exports.createUserAccount = catchError(async (req, res) => {
 
  if (!req.body.password || !req.body.conformPassword) {
    throw new AppError("Must have field 'password', 'conformPassword' ", 400);
  }
  if (req.body.password !== req.body.conformPassword) {
    throw new AppError("Password not Matched ", 400);
  }

  req.body.password = await bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUND));
  req.body.tokenStr = crypto.randomBytes(24).toString('hex');
  req.body.accountType = "public";
  req.body.uId = "cz" + crypto.randomBytes(10).toString('hex');

  let resultAccount = await userAccount.create(req.body);

  /* create  activation account data  */
  let activateAccountdata = {
    verficationType: "activateAccount",
    tokenStr: crypto.randomBytes(24).toString('hex'),
    tokenNo: Math.round((Math.random() * 1000000)).toString(),
    email: req.body.email,
    expireAt: Date.now() + constant.ACTIVATE_ACCOUNT_EXPIRE_TIME,
    userId: resultAccount.uId,
  };

  let result = await accountVerfication.create(activateAccountdata);

  let activateUrl = `${process.env.SELF_URL}/activate?email=${encodeURIComponent(result.email)}&tokenType=tkString&tokenValue=${result.tokenStr}`;
  let emailTemplate = fs.readFileSync(__dirname + "/../views/act_acc_email.html", "utf-8");

  emailTemplate = emailTemplate.replace("{{$activate_code}}", result.tokenNo);
  emailTemplate = emailTemplate.replace("{{$activate_url}}", activateUrl);
  emailTemplate = emailTemplate.replace("{{$activate_url}}", activateUrl);
  emailTemplate = emailTemplate.replace("{{$email}}", process.env.EMAIL);
  // console.log( "{{$activate_url}}", activateUrl)
  // console.log( "{{$activate_code}}", result.tokenNo)
  try {
    await utilFunc.sendEmail(result.email, "Activate Account", emailTemplate);

  }
  catch (err) {
    return res.status(500).json({ message: "Not Able  to Send Activation Link" });
  }

  let resData = { message: "Account Registered Successfully. Please Check your Email to Activate Account." };
  if( req.body.data == "yes") { 
    resData.data = resultAccount;
  }
  return res.status(201).json(resData) ; 

});

module.exports.resendActivationLink = catchError(async (req, res) => {
 
  req.body.email  = req.body.email ? req.body.email.trim() : undefined; 
  req.body.password  = req.body.password ? req.body.password.trim() : undefined; 

  if (!req.body.email || !req.body.password) {
    throw new AppError("Must have field  'email'  , 'password' ", 400);
  }
    
  let resultAccount = await userAccount.findOne({    email: req.body.email } , { uId: 1 , password: 1});
   
  if(!resultAccount ){ 
    throw new AppError("Invalid Credentials", 401);
  }

  if( !bcrypt.compareSync( req.body.password , resultAccount.password) ){ 
    throw new AppError("Invalid Credentials", 401);
  }

  /* create  activation account data  */
  let activateAccountdata = {
    verficationType: "activateAccount",
    tokenStr: crypto.randomBytes(24).toString('hex'),
    tokenNo: Math.round((Math.random() * 1000000)).toString(),
    email: req.body.email,
    expireAt: Date.now() + constant.ACTIVATE_ACCOUNT_EXPIRE_TIME,
    userId: resultAccount.uId,
  };

  let result = await accountVerfication.create(activateAccountdata);

  let activateUrl = `${process.env.SELF_URL}/activate?email=${encodeURIComponent(result.email)}&tokenType=tkString&tokenValue=${result.tokenStr}`;
  let emailTemplate = fs.readFileSync(__dirname + "/../views/act_acc_email.html", "utf-8");
  emailTemplate = emailTemplate.replace("{{$activate_code}}", result.tokenNo);
  emailTemplate = emailTemplate.replace("{{$activate_url}}", activateUrl);
  emailTemplate = emailTemplate.replace("{{$activate_url}}", activateUrl);
  emailTemplate = emailTemplate.replace("{{$email}}", process.env.EMAIL);

  try {
    await utilFunc.sendEmail(result.email, "Activate Account", emailTemplate);

  }
  catch (err) {
    return res.status(500).json({ message: "Not Able  to Send Activation Link" });
  }

  return res.status(200).json({ message: "Link Sent Successfully. Please Check your Email to Activate Account." });

});

// ######## Activate Account with Code and Link  ########
module.exports.activateAccount = catchError(async (req, res) => {
 
  let filters = [{ verficationType: "activateAccount" }];
  if (req.query.tokenType == "tkString") {
    req.query.email = req.query.email ? req.query.email.trim() : undefined;
    req.query.tokenValue = req.query.tokenValue ? req.query.tokenValue.trim() : undefined;

    if (!req.query.email || !req.query.tokenValue) {
      throw new AppError("Invalid Activation Link", 400);
    }
    filters.push({ email: req.query.email });
    filters.push({ tokenStr: req.query.tokenValue });
  }
  else if (req.body.tokenType == "tkNumber") {
    req.body.email = req.body.email ? req.body.email.trim() : undefined;
    req.body.tokenValue = req.body.tokenValue ? req.body.tokenValue.trim() : undefined;
    filters.push({ email: req.body.email });
    filters.push({ tokenNo: req.body.tokenValue });
  }
  else {
    throw new AppError("Invalid Activation Method", 400);
  }

  let result = await accountVerfication.findOne({  $and: filters}, { userId: 1, expireAt: 1}).limit(1).sort({createdAt : -1});
  // /

  if (result) {
    if (result.expireAt < Date.now()) {
      throw new AppError("Activation Link Expired. Try generating New link", 400);
    }
    /* update Account accountStatus as 'active' */

    await userAccount.updateOne({ uId: result.userId }, { $set: { accountStatus: 'active' } });

    res.redirect(req.user ? "/home" : "/login");

    /* delete  activate account  data  */
    await accountVerfication.deleteOne({ _id: result._id });
    
  }
  else {
    return res.status(400).json({ message: "Invalid Verification Link" });

  }

});

// ######## Send Reset Password Link ########
module.exports.sendResetPasswordEmail = catchError(async (req, res) => {

  req.body.email = req.body.email ? req.body.email.trim() : undefined;

  if (!req.body.email) {
    throw new AppError("Must have 'email'", 400);
  }

  /* Check if  Account Exist or Not  */

  let resultAccount = await userAccount.findOne({ email: req.body.email });

  if (!resultAccount) {
    throw new AppError("Account Not Exists", 404);
  }

  /* create  Reset Password  data  */
  let activateAccountdata = {
    verficationType: "resetPassword",
    tokenStr: crypto.randomBytes(24).toString('hex'),
    tokenNo: Math.round((Math.random() * 1000000)).toString(),
    email: req.body.email,
    expireAt: Date.now() + constant.RESET_PASSWORD_EXPIRE_TIME,
    userId: resultAccount.uId,
  };

  let result = await accountVerfication.create(activateAccountdata);

  let activateUrl = `${process.env.SELF_URL}/verify_token?email=${encodeURIComponent(result.email)}&tokenType=tkString&tokenValue=${result.tokenStr}`;
  let emailTemplate = fs.readFileSync(__dirname + "/../views/reset_pass_email.html", "utf-8");

  emailTemplate = emailTemplate.replace("{{$activate_code}}", result.tokenNo);
  emailTemplate = emailTemplate.replace("{{$activate_url}}", activateUrl);
  emailTemplate = emailTemplate.replace("{{$activate_url}}", activateUrl);
  emailTemplate = emailTemplate.replace("{{$email}}", process.env.EMAIL);

  try {
    await utilFunc.sendEmail(result.email, "Reset Account Password", emailTemplate);

  }
  catch (err) {
    return res.status(500).json({ message: "Not Able  to Send Reset Password Link" });
  }

  return res.status(200).json({ message: "Reset Password Link seneded Successfully. Please Check your Email." });

});

// ######## Verify token  for reset password  ########
module.exports.verifyToken = catchError(async (req, res) => {

  let filters = [{ verficationType: "resetPassword" }];
  if (req.query.tokenType == "tkString") {
    req.query.email = req.query.email ? req.query.email.trim() : undefined;
    req.query.tokenValue = req.query.tokenValue ? req.query.tokenValue.trim() : undefined;

    if (!req.query.email || !req.query.tokenValue) {
      throw new AppError("Invalid Verfication Link", 400);
    }
    filters.push({ email: req.query.email });
    filters.push({ tokenStr: req.query.tokenValue });
  }
  else if (req.body.tokenType == "tkNumber") {
    req.body.email = req.body.email ? req.body.email.trim() : undefined;
    req.body.tokenValue = req.body.tokenValue ? req.body.tokenValue.trim() : undefined;
    filters.push({ email: req.body.email });
    filters.push({ tokenNo: req.body.tokenValue });
  }
  else {
    throw new AppError("Invalid Reset Password Method", 400);
  }

  let result = await accountVerfication.findOne({ $and: filters }, { userId: 1, expireAt: 1 });

  if (result) {
    if (result.expireAt < Date.now()) {
      throw new AppError("Link Expired. Try generating New link", 400);
    }

    /* if verification method is link
             then redirect to update password page  
             else response as success  
        */
    if (req.query.tokenType == "tkString") {
      res.redirect(`/update_pass?email=${encodeURIComponent(req.query.email)}&tokenType=tkString&tokenValue=${req.query.tokenValue}`);
    }
    else {
      return res.status(200).json({ message: "Verified Successfully" });
    }

    // let resultAccount = await userAccount.updateOne({ uId: result.userId }, { $set: { accountStatus: 'active' } });

    //    /* delete  activate account  data  */
    //  await accountVerfication.deleteOne({ _id : result._id }); 

  }
  else {
    return res.status(400).json({ message: "Invalid Verification Link" });

  }

});

// ########   Update password   ########
module.exports.updatePassword = catchError(async (req, res) => {

  req.body.email = req.body.email ? req.body.email.trim() : undefined;
  req.body.tokenValue = req.body.tokenValue ? req.body.tokenValue.trim() : undefined;
  req.body.password = req.body.password ? req.body.password.trim() : undefined;
  req.body.conformPassword = req.body.conformPassword ? req.body.conformPassword.trim() : undefined;

  if (!req.body.email || !req.body.tokenValue || !req.body.password || !req.body.conformPassword) {
    throw new AppError("Must have field 'email', 'tokenValue', 'password', 'conformPassword'", 400);
  }

  if (req.body.password !== req.body.conformPassword) {
    throw new AppError("Password Not matched", 400);
  }

  if (req.body.password.length <= 6) {
    throw new AppError("Password length must be greater than 6  charcter", 400);
  }

  let filters = [{ verficationType: "resetPassword" }];

  if (req.body.tokenType == "tkString") {
    filters.push({ tokenStr: req.body.tokenValue });
  }
  else if (req.body.tokenType == "tkNumber") {
    filters.push({ tokenNo: req.body.tokenValue });
  }
  else {
    throw new AppError("Invalid Update Password Method", 400);
  }

  let result = await accountVerfication.findOne({ $and: filters }, { email: 1, userId: 1, expireAt: 1 });

  if (result) {
    if (result.expireAt < Date.now()) {
      throw new AppError("Link Expired. Try generating New link", 400);
    }

    /* Update Account Password */

    let resultAccount = await userAccount.updateOne({ uId: result.userId }, {
      $set: {
        password: await bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUND))
      }
    });

    if (resultAccount.nModified == 1) {
      res.status(200).json({ message: "Password Updated  Successfully" });
    }
    else {
      throw new AppError("Not Able to Update", 500);
    }

    /* delete  reset password   data  */
    await accountVerfication.deleteOne({ _id: result._id });

  }
  else {
    return res.status(400).json({ message: "Invalid Verification Link" });
  }

});
