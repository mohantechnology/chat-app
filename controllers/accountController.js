const path = require('path');
const catchError = require('../middlewares/catchError');
const AppError = require("../utils/AppError");
const utilFunc = require("../utils/utilFunc");
const constant = require("../utils/constant");
const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');

/* import models */
const userAccount = require('../model/userAccount');
const accountVerfication = require('../model/accountVerfication');

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

// module.exports.sendEmail =  async  (receiverAddresses, subject, html) =>{


//   return new Promise(async (resolve, reject) => {

//     try {


//       // Create the SMTP transport.
//       let  transporter = nodemailer.createTransport({
//         service: process.env.SERVICE || 'gmail',
//         host:process.env.HOST || 'smtp.gmail.com',
//         port: process.env.EMAIL_PORT || 465,
//         secure: true,
//         auth: {
//           user:process.env.EMAIL,
//           pass:process.env.EMAIL_PASS
//         }
//       });

//           // Specify the fields in the email.
//       let  mailOptions = {
//         from: process.env.EMAIL,
//         to:   receiverAddresses ,
//         subject: subject, 
//         html: html, 

//       };



//       // Send the email.
//       let info = await transporter.sendMail(mailOptions) 
//       console.log("Message sent! Message ID: ", info.messageId);
//       resolve(info)
//     }
//     catch (err) {
//       console.log(err);
//       reject(err)
//     }
//   });
// }




module.exports.logout = catchError( async(req, res, next) => {
    res.cookie('sid', "", { expires: 0, httpOnly: true });
    let query = {$and : [ { email: req.user.email ,accessToken : req.user.accessToken  }]}
    let resultAccount  =    await userAccount.updateOne(query,   {  currentStatus:"offline" })  ; 
    return res.status(200).json({ message: "Logout Successfully" })

})

module.exports.registerPage = (req, res, next) => {
    console.log("register get ")
    res.sendFile(VEIW_DIR + "/reg.html");
}

module.exports.loginPage = (req, res, next) => {
    res.sendFile(VEIW_DIR + "/login.html");
}
module.exports.landingPage = (req, res, next) => {
    res.redirect("/login")
}


module.exports.activateAccountPage = (req, res, next) => {
    res.sendFile(VEIW_DIR + "/activate.html");
}

module.exports.forgotPasswordPage = (req, res, next) => {
    res.sendFile(VEIW_DIR + "/forgot.html");
}

module.exports.updatePasswordPage = (req, res, next) => {
    res.sendFile(VEIW_DIR + "/reset.html");
}


module.exports.loginUserAccount = catchError(async (req, res, next) => {
    // console.log( "req.body")
    // console.log( req.body)

    req.body.email = req.body.email ? req.body.email.trim() : undefined;
    req.body.password = req.body.password ? req.body.password.trim() : undefined;

    if (!req.body.email || !req.body.password) {
        throw new AppError("Must have field 'email', 'password' ", 400)
    }

    let accessToken = "tk" + crypto.randomBytes(10).toString('hex');
    let tokenExpireAt = (new Date(Date.now() + 6000000)).getTime();
    let result = await userAccount.findOneAndUpdate({ email: req.body.email }, { accessToken, tokenExpireAt , currentStatus:"online" }, { new: true });

    // cprint({tokenExpireAt},  "") ; 

    if (result) {
        if (await bcrypt.compare(req.body.password, result.password)) {
            // save  data to jwt token

            let token = jwt.sign(
                { email: result.email, accessToken, _id: result._id, uId: result.uId, name: result.name, profMess: result.profMess, profileImg: result.profMess },
                process.env.JWT_SECRET_KEY);

            res.cookie('sid', token, { expires: new Date(Date.now() + 6000000), httpOnly: true });
            return res.status(200).json({ message: "verfiy successfully", data: result },)
        }
        else {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

    }
    return res.status(400).json({ message: "Account Not Exists" })

})




module.exports.createUserAccount = catchError(async (req, res, next) => {

    // console.log( "createUserAccount")
    console.log("req.body")
    console.log(req.body)
    // console.log(  await userAccount.deleteMany())
    // throw new AppError( "my message",500, "validation")
    //   console.log( await userAccount.collection.drop() ) 



    if (!req.body.password || !req.body.conformPassword) {
        throw new AppError("Must have field 'password', 'conformPassword' ", 400)
    }
    if (req.body.password !== req.body.conformPassword) {
        throw new AppError("Password not Matched ", 400)
    }


    req.body.password = await bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUND));
    req.body.tokenStr = crypto.randomBytes(24).toString('hex');
    req.body.accountType = "public";
    req.body.uId = "cz" + crypto.randomBytes(10).toString('hex');
    console.log("req.body")
    console.log(req.body)


    let resultAccount = await userAccount.create(req.body);

    // console.log( "resultAccount")
    // console.log( resultAccount)


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

    console.log("result")
    console.log(result)

    console.log("activateUrl")
    console.log(activateUrl)

    try {
        await utilFunc.sendEmail(result.email, "Activate Account", emailTemplate);

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Not Able  to Send Activation Link" });
    }


    return res.status(201).json({ message: "Account Registered Successfully. Please Check your Email to Activate Account." })


});


// ######## Activate Account with Code and Link  ########
module.exports.activateAccount = catchError(async (req, res, next) => {
    console.log("  req.query")
    console.log(req.query)


    // req.params.tokenType = req.params.tokenType ? req.params.tokenType.trim() : undefined;

    let accessToken = "tk" + crypto.randomBytes(10).toString('hex');
    let currntTime = (new Date(Date.now() + 6000000)).getTime();

    let filters = [{ verficationType: "activateAccount" }];
    if (req.query.tokenType == "tkString") {
        req.query.email = req.query.email ? req.query.email.trim() : undefined;
        req.query.tokenValue = req.query.tokenValue ? req.query.tokenValue.trim() : undefined;

        if (!req.query.email || !req.query.tokenValue) {
            throw new AppError("Invalid Activation Link", 400)
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

    let result = await accountVerfication.findOne({ $and: filters }, { userId: 1, expireAt: 1 });

    //    console.log ( "result")
    //    console.log ( result)

    if (result) {
        if (result.expireAt < Date.now()) {
            throw new AppError("Activation Link Expired. Try generating New link", 400);
        }
        /* update Account accountStatus as 'active' */

        let resultAccount = await userAccount.updateOne({ uId: result.userId }, { $set: { accountStatus: 'active' } });
        // console.log("resultAccount")
        // console.log(resultAccount)

        res.redirect(req.user ? "/home" : "/login");

        /* delete  activate account  data  */
        await accountVerfication.deleteOne({ _id: result._id });

    }
    else {
        return res.status(400).json({ message: "Invalid Verification Link" })

    }


})


// ######## Send Reset Password Link ########
module.exports.sendResetPasswordEmail = catchError(async (req, res, next) => {
    console.log("  req.query")
    console.log(req.query)
    // console.log(   await accountVerfication.collection.drop()); 

    req.body.email = req.body.email ? req.body.email.trim() : undefined;

    if (!req.body.email) {
        throw new AppError("Must have 'email'", 400)
    }

    /* Check if  Account Exist or Not  */

    let resultAccount = await userAccount.findOne({ email: req.body.email });

    if (!resultAccount) {
        throw new AppError("Account Not Exists", 404)
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

    console.log("result")
    console.log(result)

    console.log("activateUrl")
    console.log(activateUrl)

    try {
        await utilFunc.sendEmail(result.email, "Reset Account Password", emailTemplate);

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Not Able  to Send Reset Password Link" });
    }


    return res.status(200).json({ message: "Reset Password Link seneded Successfully. Please Check your Email." })


})


// ######## Verify token  for reset password  ########
module.exports.verifyToken = catchError(async (req, res, next) => {
    console.log("  req.query")
    console.log(req.query)
    // console.log("  req.headers")
    // console.log(req.headers)


    let filters = [{ verficationType: "resetPassword" }];
    if (req.query.tokenType == "tkString") {
        req.query.email = req.query.email ? req.query.email.trim() : undefined;
        req.query.tokenValue = req.query.tokenValue ? req.query.tokenValue.trim() : undefined;

        if (!req.query.email || !req.query.tokenValue) {
            throw new AppError("Invalid Verfication Link", 400)
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

    //    console.log ( "result")
    //    console.log ( result)

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
        // console.log("resultAccount")
        // console.log(resultAccount)


        //    /* delete  activate account  data  */
        //  await accountVerfication.deleteOne({ _id : result._id }); 

    }
    else {
        return res.status(400).json({ message: "Invalid Verification Link" })

    }


})


// ########   Update password   ########
module.exports.updatePassword = catchError(async (req, res, next) => {
    console.log("  req.query")
    console.log(req.query)


    req.body.email = req.body.email ? req.body.email.trim() : undefined;
    req.body.tokenValue = req.body.tokenValue ? req.body.tokenValue.trim() : undefined;
    req.body.password = req.body.password ? req.body.password.trim() : undefined;
    req.body.conformPassword = req.body.conformPassword ? req.body.conformPassword.trim() : undefined;


    if (!req.body.email || !req.body.tokenValue || !req.body.password || !req.body.conformPassword) {
        throw new AppError("Must have field 'email', 'tokenValue', 'password', 'conformPassword'", 400)
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

    //    console.log ( "result")
    //    console.log ( result)

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
            res.status(200).json({ message: "Password Updated  Successfully" })
        }
        else {
            throw new AppError("Not Able to Update", 500);
        }

        /* delete  reset password   data  */
        await accountVerfication.deleteOne({ _id: result._id });

    }
    else {
        return res.status(400).json({ message: "Invalid Verification Link" })
    }


})


