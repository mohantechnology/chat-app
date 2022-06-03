const path = require('path'); 
const  VEIW_DIR =  path.resolve(  __dirname + "/../views" ) ; 
const userAccount = require('../model/userAccount');
const catchError = require('../middlewares/catchError');
const AppError  = require("./../utils/AppError");

 module.exports.logout = (req, res,next)=>{
    res.send("connected----------s**>") ; 
    
}

module.exports.register = (req, res,next)=>{ 
    console.log( "register get ")
    res.sendFile( VEIW_DIR+ "/reg.html");
}

module.exports.login = (req, res,next)=>{ 
    res.sendFile(   VEIW_DIR+ "/login.html");
}


module.exports.createUserAccount = catchError(async (req, res,next)=>{ 
    
    // console.log( "createUserAccount")
    // console.log( "req.body")
    // console.log( req.body)
    // console.log(  await userAccount.find())
    // throw new AppError( "my message",500, "validation")
    let result = await userAccount.create( req.body ) ;
    
    console.log( result ) ;  
}) ; 