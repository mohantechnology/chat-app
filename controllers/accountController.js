const path = require('path'); 
const catchError = require('../middlewares/catchError');
const AppError  = require("../utils/AppError");
const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const fs = require('fs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

/* import models */
const userAccount = require('../model/userAccount');

const  VEIW_DIR =  path.resolve(  __dirname + "/../views" ) ; 

function cprint(  varObj ,dividerStr){

   if(dividerStr !== undefined)    {
       let myStr = "-" ; 
    for( i=0;i<4  ;  i++){
        myStr+=myStr
    }
    console.log(myStr )
} 
    console.log( Object.keys(varObj)[0] );
    console.log( Object.values(varObj)[0]);
}

module.exports.sendEmail =  async  (receiverAddresses, subject, html) =>{


  return new Promise(async (resolve, reject) => {

    try {


      // Create the SMTP transport.
      let  transporter = nodemailer.createTransport({
        service: process.env.SERVICE || 'gmail',
        host:process.env.HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 465,
        secure: true,
        auth: {
          user:process.env.EMAIL,
          pass:process.env.EMAIL_PASS
        }
      });

          // Specify the fields in the email.
      let  mailOptions = {
        from: process.env.EMAIL,
        to:   receiverAddresses ,
        subject: subject, 
        html: html, 
       
      };

  

      // Send the email.
      let info = await transporter.sendMail(mailOptions) 
      console.log("Message sent! Message ID: ", info.messageId);
      resolve(info)
    }
    catch (err) {
      console.log(err);
      reject(err)
    }
  });
}

 


 module.exports.logout = (req, res,next)=>{
    res.cookie('sid', "",  { expires: 0, httpOnly: true });
     return res.status( 200). json({ message : "Logout Successfully"} )
    
}

module.exports.register = (req, res,next)=>{ 
    console.log( "register get ")
    res.sendFile( VEIW_DIR+ "/reg.html");
}

module.exports.login = (req, res,next)=>{ 
    console.log( "login get ")
    res.sendFile( VEIW_DIR+ "/login.html");
}

module.exports.loginUserAccount = catchError( async(req, res,next)=>{ 
    // console.log( "req.body")
    // console.log( req.body)

    req.body.email = req.body.email ?req.body.email.trim(): undefined ; 
    req.body.password = req.body.password ?req.body.password.trim(): undefined ; 
    
    if( !req.body.email ||!req.body.password  ){ 
        throw new AppError("Must have field 'email', 'password' " ,400)
    }
   
    let accessToken =    "tk"  + crypto.randomBytes(10).toString('hex');
    let tokenExpireAt =  new Date(Date.now() + 6000000) ; 
    let result = await userAccount.findOneAndUpdate({ email: req.body.email}, {accessToken ,tokenExpireAt}) ; 
  
    // cprint({result},  "") ; 
 
    if( result){
    if( await bcrypt.compare(req.body.password, result.password  ) ) {  
        // save  data to jwt token
        
        let token = jwt.sign({ email: result.email,accessToken , _id: result._id  }, process.env.JWT_SECRET_KEY);
         res.cookie('sid', token,  { expires: new Date(Date.now() + 6000000), httpOnly: true });
         return res.status( 200). json({ message : "verfiy successfully"} )
    }
    else { 
        return res.status( 400). json({ message : "Invalid Credentials"} )
    }
     
}
      return res.status( 400). json({ message : "Account Not Exists"} )
 
})







module.exports.createUserAccount = catchError(async (req, res,next)=>{ 
    
    // console.log( "createUserAccount")
    console.log( "req.body")
    console.log( req.body)
    // console.log(  await userAccount.deleteMany())
    // throw new AppError( "my message",500, "validation")
//   console.log( await userAccount.collection.drop() ) 
 


   if( !req.body.password ||!req.body.conformPassword  ){ 
       throw new AppError("Must have field 'password', 'conformPassword' " ,400)
   }
      if( req.body.password !==req.body.conformPassword  ){ 
       throw new AppError("Password not Matched " ,400)
   }

 
   req.body.password =  await bcrypt.hash(   req.body.password , parseInt( process.env.SALT_ROUND));
    req.body.uId =   "cz"  + crypto.randomBytes(10).toString('hex');
    req.body.tokenStr = crypto.randomBytes(24).toString('hex');
    req.body.tokenNo = Math.round((Math.random() * 1000000)).toString();
    req.body.accountType="public";

  console.log( "req.body")
  console.log( req.body)
 

    let result = await userAccount.create( req.body ) ; 

    console.log( "result")
    console.log( result)
  
    let activateUrl= `${process.env.SELF_URL}/activate/${result.email}/token_str/${result.tokenStr}`; 
    let emailTemplate = fs.readFileSync(__dirname+ "/../views/act_acc_email.html","utf-8"); 
 
    emailTemplate=  emailTemplate.replace("{{$activate_code}}",result.tokenNo); 
    emailTemplate=  emailTemplate.replace("{{$activate_url}}",activateUrl); 
    emailTemplate= emailTemplate.replace("{{$activate_url}}",activateUrl); 
    emailTemplate= emailTemplate.replace("{{$email}}",process.env.EMAIL);    
         

    try{
        await this.sendEmail(  result.email, "Activate Account",emailTemplate) ; 
        
    }
    catch(err){
        console.log( err) ; 
        return   res.status(500).json({ message: "Not Able  to Send Activation Link" });
    }
   

    return res.status( 201). json({ message : "Account Registered Successfully. Please Check your Email to Activate Account."} )
    
 
}) ; 

