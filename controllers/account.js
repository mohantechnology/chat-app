var path = require('path'); 
const  VEIW_DIR =  path.resolve(  __dirname + "/../views" ) ; 

 module.exports.logout = (req, res,next)=>{
    res.send("connected----------s**>") ; 
    
}

module.exports.register = (req, res,next)=>{ 
    res.sendFile( VEIW_DIR+ "/reg.html");
}

module.exports.login = (req, res,next)=>{ 
    res.sendFile(   VEIW_DIR+ "/login.html");
}