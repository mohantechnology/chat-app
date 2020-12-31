// 'use strict';
require('dotenv').config(); 
const { response } = require('express');
const express = require('express');
const axios = require('axios');
const app = express();
const jwt = require("jsonwebtoken"); 
var view_dir_name = __dirname + "/views"

// app.set('views', (__dirname, '/views/'))
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser"); 


app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
console.log(__dirname, '/views');
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }))



app.set("view engine","hbs"); 
app.set("views" , "views")



app.get('/', (req, res) => {
  res.send({"status":"ok","message":"connected to server"}); 
  // res.render("find_friend"); 
//  res.sendFile("find_friend"); 
});



app.get('/login', (req, res) => {
  res.sendFile(view_dir_name + "/login.html");
});





app.post('/login', (req, res) => {

  axios({
    method: 'post',
    url:  process.env.API_URL+"/login"   ,
    data: req.body
   
  }).then(function (response) {
    console.log(response.data);
    if(response.data.status=="ok"){
  
       let token = jwt.sign({email:response.data.email,name:response.data.name,u_id:response.data.u_id,token:response.data.token,p_id:response.data.p_id } ,process.env.JWT_SECRET_KEY); 
       res.cookie("li",token,{expires:new Date(Date.now()+6000000)}); 
      console.log("cookie encodded",token); 
       console.log("succesfull set cookie ",jwt.decode(token)); 
       res.send({"status":"ok"}); 

    }
    else{
      res.send(response.data); 
    }
  }).catch(err=>{
    console.log("error is: "); 
    console.log(err); 
    res.status(500).send({"status":"Internal server error"});
  });

  // res.send(view_dir_name + "/login.html");
});






app.get('/profile', (req, res) => {


  
  let cookie_data = jwt.decode( req.cookies.li); 
 console.log("incoming cookie data",cookie_data); 
  axios({
    method: 'post',
    url:  process.env.API_URL+"/profile"   ,
    data: cookie_data
  }).then(function (response) {
    console.log(response.data);
    if(response.data.status =="ok"){
      let r_data =  (response.data); 
      
        res.render("home",{ data: r_data.data ,name:r_data.name}); 
       

    }
    else{
      res.send(response.data);
     
    }
  }).catch(err=>{
    console.log("error is: "); 
    console.log(err); 
    res.status(500).send({"status":"Internal server error"});
  });

   
});


app.get('/find_friend', (req, res) => {
   res.sendFile(view_dir_name + "/find_friend.html"); 
}); 

app.post('/find_friend', (req, res) => {


  
  let cookie_data = jwt.decode( req.cookies.li); 
  if(cookie_data){
    cookie_data.search_value=req.body.search_value; 
  }

 console.log("incoming cookie data from find-friend ",cookie_data,req.body); 
  axios({
    method: 'post',
    url:  process.env.API_URL+"/find_friend"   ,
    data: cookie_data
  }).then(function (response) {
    console.log(response.data);
    res.send(response.data); 
  }).catch(err=>{
    console.log("error is: "); 
    console.log(err); 
    res.status(500).send({"status":"Internal server error"});
  });

   
});


app.post('/send_friend_request', (req, res) => {


  
  let cookie_data = jwt.decode( req.cookies.li); 
  if(cookie_data){
    cookie_data.friend_p_id=req.body.p_id; 
    cookie_data.date=req.body.date; 
    cookie_data.time=req.body.time; 
  }

 console.log("incoming cookie data from send_friend_request",cookie_data); 
  axios({
    method: 'post',
    url:  process.env.API_URL+"/send_friend_request"   ,
    data: cookie_data
  }).then(function (response) {
    console.log(response.data);
    res.send(response.data); 
  }).catch(err=>{
    console.log("error is: "); 
    console.log(err); 
    res.status(500).send({"status":"Internal server error"});
  });

   
});

app.get('/reg', (req, res) => {

  res.sendFile(view_dir_name + "/reg.html");
});

app.post('/reg', (req, res) => {

  axios({
    method: 'post',
    url: process.env.API_URL + "/register" ,
    data: req.body
  }).then(function (response) {
    console.log(response.data);
    res.send(response.data); 
  }).catch(error=>{
    res.json({status: "error",message: "something went wrong "}); 
  });

});

app.get('/activate/:email/:t_name/:t_value', (req, res) => {
  console.log("incoming data at actiavte app ",req.params); 
  let data = {email: req.params.email}; 
  data[req.params.t_name]= req.params.t_value; 
  console.log("ingoing  data at actiavte app ",data); 
  axios({
    method: 'post',
    url: process.env.API_URL + "/activate" ,
    data
  }).then(function (response) {
    console.log(response.data);
    res.send(response.data); 
  }).catch(error=>{
    res.json({status: "error",message: "something went wrong "}); 
  });

});

app.get('/forgot', (req, res) => {

  res.sendFile(view_dir_name + "/forgot.html");
});
app.get('/reset', (req, res) => {

  res.sendFile(view_dir_name + "/reset.html");
});


// app.get('/test', (req, res) => {

//   res.sendFile(view_dir_name + "/test.html");
// });

app.get('/first-col.js', (req, res) => {

  res.sendFile(view_dir_name + "/first-col.js");
});

app.get('/test', (req, res) => {
  (async () => {
    const { body } = await got.get('www.youtube.com', {
      json: {
        hello: 'world'
      },
      responseType: 'json'
    });

    console.log(body.data); res.send(body.data);
    // => {hello: 'world'}
  })();

});





app.get("/*",(req,res)=>{
  res.status(404).send({"status":"error",message:"page not found from 1"})
})



// require('crypto').randomBytes(48, function(err, buffer) {
//   var token = buffer.toString('hex');
// });
// var token = crypto.randomBytes(64).toString('hex');
app.listen(3000, () => {
  console.log("listening at 3000");
});


