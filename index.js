// 'use strict';
require('dotenv').config();
const { response } = require('express');
const express = require('express');
const axios = require('axios');
const app = express();
const fs = require('fs');
const jwt = require("jsonwebtoken");
var view_dir_name = __dirname + "/views"
const fileUpload = require('express-fileupload');
var nodemailer = require('nodemailer');
const cookieParser = require("cookie-parser");
const cors = require('cors')
const bodyParser = require('body-parser');
const { strict } = require('assert');
const { fips } = require('crypto');
app.set('views', (__dirname, '/views/'))




var port = process.env.PORT || 3000;


// var cors_opt = {
//   origin:"https://php-file-api.000webhostapp.com/transfer_file.php"
// }


app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
// console.log(__dirname, '/views');
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors( { credentials: true}));


app.set("view engine", "hbs");
app.set("views", "views")




app.use(fileUpload({
  limits: { fileSize: 10000000 * 100000 },
}));





app.get("/", (req, res) => {
  // res.sendFile(__dirname + "/temp.html");
  res.sendFile(view_dir_name + "/login.html");
});




// transfer_file

app.post('/transfer_file/:curr_f_id/:file_mess?', function (req, res) {

  let up_file; 
 

  // if file is present then  update the file in database also and delete prev file 
  if (req.files && req.files.transfer_file ) {

 let cookie_data = jwt.decode(req.cookies.li);
 if(!cookie_data){
   return {status: "error", message : "token expired"}
  
 }
 cookie_data.file_name = req.files.transfer_file.name; 
 cookie_data.file_mess = req.params.file_mess; 
 cookie_data.curr_f_id =  req.params.curr_f_id; 
 cookie_data.mime_type = req.files.transfer_file.mimetype; 
 

    axios({
      method: 'post',
      url: process.env.API_URL + "/transfer_file",
      data: cookie_data
    }).then(function (response) {

      if (response.data.status == "ok") {
        let r_data = (response.data);
   
      
        let sampleFile = req.files.transfer_file;
        //create folder if not exist 
        let path_link =__dirname + `/public/transfer_file/${r_data.folder_name}`;
        // let path_link =__dirname + `/transfer_file`;
        
        if (!fs.existsSync(path_link)) {
          fs.mkdirSync(path_link); 
        }
        sampleFile.mv(path_link+"/"+r_data.curr_file_name, function (err) {
          if (err) {

            res.send({ status: "error", message: err.message });
          }
          else{
            res.send({status:"ok",file_link: r_data.curr_file_name,file_name:r_data.file_name,mime_type:sampleFile.mimetype,folder_name: r_data.folder_name }); 
          }

        }); 
         
     
        } else {
        res.send({ status: "error", message: "File is not sended successfully" });
      }
    }).catch(err => {

      // ### ca
      res.status(500).send({ "status": "Internal server error",error:err });

    }); 
  }else{
    res.send({status:"error",message:"File not present" }); 
  }

  });




  //tranfer without file 
  app.post('/transfer_without_file', function (req, res) {

   
  
    // if file is present then  update the file in database also and delete prev file 
  

    // return res.send({status: "ok" , message: "succefully connected "}); 

   let cookie_data = jwt.decode(req.body.li);
   cookie_data.file_name = req.body.file_name; 
   cookie_data.file_mess =req.body.file_mess; 
   cookie_data.curr_f_id =  req.body.curr_f_id; 
   cookie_data.mime_type = req.body.mime_type; 

   
      axios({
        method: 'post',
        url: process.env.API_URL + "/transfer_file",
        data: cookie_data
      }).then(function (response) {


        if (response.data.status == "ok") {
          res.send(response.data); 
          } else {
          ({ status: "error", message: "File is not sended successfully" });
        }
      }).catch(err => {

        // ### ca
        res.status(500).send({ "status": "Internal server error",error:err });
  
      }); 
   
  
    });
  

  // download transfer_file

app.get('/download/:folder/:file/:file_name?', function (req, res) {


 
        let path_link =__dirname + `/public/transfer_file/${req.params.folder}/${req.params.file}`;
        // let path_link =__dirname + `/transfer_file`;
       
          if(req.params.file_name)
         {    
        res.download(path_link,req.params.file_name)
           }
       else{
          res.download(path_link)
       }
         


  });






// upload profile image 
app.post('/update_prof/:acc_tp?/:pro_mess?', function (req, res) {
  // console.log(req.files); 

  let up_file
  let cookie_data = jwt.decode(req.cookies.li);
  // if file is present then  update the file in database also and delete prev file 
  if(!cookie_data){
    return {status: "error", message : "token expired"}
   
  }
  if (req.files) {
    up_file = req.files.myfile;
    cookie_data.is_file = 1;
    if (req.files.myfile) {
      cookie_data.file_name = req.files.myfile.name
    }
  } else {
    if(!cookie_data){
      cookie_data ={}; 
    }
    cookie_data.is_file = 0;
  }
  cookie_data.pro_mess = req.params.pro_mess;
  cookie_data.account_type = req.params.acc_tp;
  axios({
    method: 'post',
    url: process.env.API_URL + "/update_prof",
    data: cookie_data
  }).then(function (response) {

    if (response.data.status == "ok") {
      let r_data = (response.data);

      if (cookie_data.is_file == 1) {

        let sampleFile = req.files.myfile;
        sampleFile.mv(__dirname + '/public/img/profile/' + r_data.curr_file_name, function (err) {
          if (err) {

            res.send({ status: "error", message: err.message });
          }

        });
       
        let path_link = __dirname + '/public/img/profile/' + r_data.prev_file_name; 
        if (fs.existsSync(path_link)) {
          fs.unlinkSync(path_link);
          console.log("exist and elteted");
        } else {
          console.log("not exist ");
        }
      }
      res.send({ status: "ok" });

    } else {
      res.send({ status: "error", message: "profile is not updated" });
    }
  }).catch(err => {

    res.status(500).send({ "status": "Internal server error" });
  });





});

//upload profile without image
app.post('/update_prof_without_img', function (req, res) {
  // console.log(req.files); 

  let cookie_data = jwt.decode(req.body.li);
  if(!cookie_data){
    return {status: "error", message : "token expired"}
   
  }
  // if file is present then  update the file in database also and delete prev file 
  if (req.body.is_file==true) {
    // up_file = req.files.myfile;
    cookie_data.is_file = 1;
    cookie_data.file_name = req.body.file_name;
  } else {
    
    cookie_data.is_file = 0;
  }
  cookie_data.pro_mess = req.body.pro_mess;
  cookie_data.account_type = req.body.acc_tp;

  axios({
    method: 'post',
    url: process.env.API_URL + "/update_prof",
    data: cookie_data
  }).then(function (response) {

   res.send(response.data) ; 
    
  }).catch(err => {

    res.status(500).send({ "status": "Internal server error" });
  });



});
app.post("/image", (req, res) => {
  // console.log("./imgae cllaed ")
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send("Something went wrong!");

    }
    // console.log(req.files, req.file);
    res.send(req.file);
  });
});





app.get('/login', (req, res) => {

  res.sendFile(view_dir_name + "/login.html");
});





app.post('/login', (req, res) => {

  axios({
    method: 'post',
    url: process.env.API_URL + "/login",
    data: req.body

  }).then(function (response) {

    if (response.data.status == "ok") {

      
      let token = jwt.sign({ email: response.data.email, name: response.data.name, u_id: response.data.u_id, token: response.data.token, p_id: response.data.p_id }, process.env.JWT_SECRET_KEY);
      res.cookie("li", token, { expires: new Date(Date.now() + 86400000)} );

      res.send({ "status": "ok" });

    }
    else {
      res.send(response.data);
    }
  }).catch(err => {

    res.status(500).send({ "status": "Internal server error" });
  });

  // res.send(view_dir_name + "/login.html");
});






app.get('/profile', (req, res) => {



  let cookie_data = jwt.decode(req.cookies.li);

  if( !(cookie_data) || !(cookie_data.u_id)){

   return  res.redirect("./login"); 
    
  }
  
  axios({
    method: 'post',
    url: process.env.API_URL + "/profile",
    data: cookie_data
  }).then(function (response) {

    if (response.data.status == "ok") {
      let r_data = (response.data);
      r_data.SOCKET_URL = process.env.SOCKET_URL;
      r_data.SOCKET_FILE = process.env.SOCKET_FILE;
     
      res.render("home", r_data);


    }
    else {
    
      if(response.data.message=="Account is Not Activated"){
        res.sendFile(view_dir_name + "/activate.html");
      }else if(response.data.message=="Not a valid user"){
          res.redirect("/login"); 
      }
      else{
        res.send(response.data);
      }

    }
  }).catch(err => {

    res.status(500).send({ "status": "Internal server error" });
  });


});


app.get('/find_friend', (req, res) => {

  res.render("find_friend");
});

app.get('/video-chat', (req, res) => {
  // console.log(req.param.f_id)
  // console.log( req.host)
  // console.log( req.query)
  let f_id  = req.query.f_id ; 
  if( !f_id ){ 
    res.redirect("/profile") ; 
  }
  let r_data ={};
  r_data.SOCKET_URL = process.env.SOCKET_URL;
  r_data.SOCKET_FILE = process.env.SOCKET_FILE;
 
  
  res.render("video_chat" ,r_data);
});

app.post('/find_friend', (req, res) => {



  let cookie_data = jwt.decode(req.cookies.li);
  if (cookie_data) {
    cookie_data.search_value = req.body.search_value;
  }

  axios({
    method: 'post',
    url: process.env.API_URL + "/find_friend",
    data: cookie_data
  }).then(function (response) {

    res.send(response.data);
  }).catch(err => {

    res.status(500).send({ "status": "Internal server error" });
  });


});


app.post('/send_friend_request', (req, res) => {



  let cookie_data = jwt.decode(req.cookies.li);
  if (cookie_data) {
    cookie_data.friend_p_id = req.body.p_id;
    cookie_data.date = req.body.date;
    cookie_data.time = req.body.time;
  }

  axios({
    method: 'post',
    url: process.env.API_URL + "/send_friend_request",
    data: cookie_data
  }).then(function (response) {
    res.send(response.data);
  }).catch(err => {
    res.status(500).send({ "status": "Internal server error" });
  });


});





app.post('/accept_friend_request', (req, res) => {



  let cookie_data = jwt.decode(req.cookies.li);
  if (cookie_data) {
    cookie_data.friend_p_id = req.body.p_id;
    cookie_data.date = req.body.date;
    cookie_data.time = req.body.time;
    cookie_data.signal = req.body.signal;

  }

  axios({
    method: 'post',
    url: process.env.API_URL + "/accept_friend_request",
    data: cookie_data
  }).then(function (response) {

    res.send(response.data);
  }).catch(err => {

    res.status(500).send({ "status": "Internal server error" });
  });


});


app.post('/fetch_friend', (req, res) => {



  let cookie_data = jwt.decode(req.cookies.li);
  if (cookie_data) {
    cookie_data.friend_u_id = req.body.friend_u_id;
    cookie_data.date = req.body.date;
    cookie_data.time = req.body.time;
    cookie_data.len = req.body.len;

  }


  axios({
    method: 'post',
    url: process.env.API_URL + "/fetch_friend",
    data: cookie_data
  }).then(function (response) {
      // console.log(response.data); 
    res.send(response.data);
  }).catch(err => {

    res.status(500).send({ "status": "Internal server error" });
  });


});



app.post('/fetch_remain', (req, res) => {



  let cookie_data = jwt.decode(req.cookies.li);
  if (cookie_data) {
    cookie_data.friend_u_id = req.body.friend_u_id;
    cookie_data.date = req.body.date;
    cookie_data.time = req.body.time;
    cookie_data.no = req.body.no;
    

  }


  axios({
    method: 'post',
    url: process.env.API_URL + "/fetch_remain",
    data: cookie_data
  }).then(function (response) {
   
     
    res.send(response.data);
  }).catch(err => {

    res.status(500).send({ "status": "Internal server error" });
  });


});



app.post('/display_noti', (req, res) => {



  let cookie_data = jwt.decode(req.cookies.li);
  if (cookie_data) {
    cookie_data.friend_p_id = req.body.p_id;
    cookie_data.date = req.body.date;
    cookie_data.time = req.body.time;
    cookie_data.signal = req.body.signal;

  }


  axios({
    method: 'post',
    url: process.env.API_URL + "/display_noti",
    data: cookie_data
  }).then(function (response) {

    res.send(response.data);
  }).catch(err => {
 
    res.status(500).send({ "status": "Internal server error" });
  });


});




app.post('/req', (req, res) => {



  let cookie_data = jwt.decode(req.cookies.li);
  if (cookie_data) {
    cookie_data.friend_p_id = req.body.p_id;
    cookie_data.date = req.body.date;
    cookie_data.time = req.body.time;
  }

  axios({
    method: 'post',
    url: process.env.API_URL + "/send_friend_request",
    data: cookie_data
  }).then(function (response) {

    res.send(response.data);
  }).catch(err => {

    res.status(500).send({ "status": "Internal server error" });
  });


});






app.get('/reg', (req, res) => {

  res.sendFile(view_dir_name + "/reg.html");
});

app.post('/reg', (req, res) => {

  axios({
    method: 'post',
    url: process.env.API_URL + "/register",
    data: req.body
  }).then(function (response) {

    if(response.data.status=="ok" ){
      //send activation email 

      let email_mess_bd = fs.readFileSync(view_dir_name+ "/act_acc_email.html","utf-8"); 
      //  console.log(email_mess_bd)
      let activate_url= `${process.env.SELF_URL}/activate/${response.data.email}/token_str/${response.data.token_str}`;
      email_mess_bd=  email_mess_bd.replace("{{$activate_code}}",response.data.token_no); 
      email_mess_bd=  email_mess_bd.replace("{{$activate_url}}",activate_url); 
      email_mess_bd= email_mess_bd.replace("{{$activate_url}}",activate_url); 
      email_mess_bd= email_mess_bd.replace("{{$email}}",process.env.EMAIL);    
           

      var mailOptions = {
        from: process.env.EMAIL,
        to:     response.data.email ,
        subject:"Account Activation Mail from Chat App",
    
        html: email_mess_bd ,      
       
      };

    
    
      var transporter = nodemailer.createTransport({
        service: process.env.SERVICE || 'gmail',
        host:process.env.HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 465,
        secure: true,
        auth: {
          user:process.env.EMAIL,
          pass:process.env.EMAIL_PASS
        }
      });
// console.log(mailOptions); 
// console.log(transporter); 
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
        
          res.send({status: "error" , message : "Activation link is not sent to your Mail. Check if you have registered with valid email . For more details contact us at "+process.env.EMAIL});
        } else {
          res.send({status: "ok" , message : "Mailed successfully"} );
            
        
        }


        

      });
    
    }
    else{
      res.send({status:response.data.status, message: response.data.message});
    }
  }).catch(error => {
 
    res.json({ status: "error", message: "something went wrong " });
  });

});



app.get('/active', (req, res) => {

 res.sendFile(view_dir_name + "/activate.html")

});



app.get('/activate/:email/:t_name/:t_value', (req, res) => {

  let data = { email: req.params.email };
  data[req.params.t_name] = req.params.t_value;

  axios({
    method: 'post',
    url: process.env.API_URL + "/activate",
    data
  }).then(function (response) {

    if(response.data.status=="ok" ){
      if(req.params.t_name=="token_str"){
    res.redirect("/login");
      }else{
        res.send(response.data); 
      }
   
    }else{

      res.send(response.data);
    }
  }).catch(error => {
    res.json({ status: "error", message: "something went wrong " });
  });

});

app.get('/forgot', (req, res) => {

  res.sendFile(view_dir_name + "/forgot.html");
});

app.post('/forgot_pass', (req, res) => {

  axios({
    method: 'post',
    url: process.env.API_URL + "/forgot_pass",
    data: req.body
  }).then(function (response) {

    if(response.data.status=="ok" ){
      //send activation email 

      let email_mess_bd = fs.readFileSync(view_dir_name+ "/reset_pass_email.html","utf-8"); 
      //  console.log(email_mess_bd)
      let activate_url= `${process.env.SELF_URL}/ver_reset_pass/${response.data.email}/token_str/${response.data.token_str}`;
      email_mess_bd=  email_mess_bd.replace("{{$activate_code}}",response.data.token_no); 
      email_mess_bd=  email_mess_bd.replace("{{$activate_url}}",activate_url); 
      email_mess_bd= email_mess_bd.replace("{{$activate_url}}",activate_url); 
      email_mess_bd= email_mess_bd.replace("{{$email}}",process.env.EMAIL);    
           

      var mailOptions = {
        from: process.env.EMAIL,
        to:     response.data.email ,
        subject:"Reset Password Mail from Chat App",
    
        html: email_mess_bd ,      
       
      };

    
    
      var transporter = nodemailer.createTransport({
        service: process.env.SERVICE || 'gmail',
        host:process.env.HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 465,
        secure: true,
        auth: {
          user:process.env.EMAIL,
          pass:process.env.EMAIL_PASS
        }
      });
// console.log(mailOptions); 
// console.log(transporter); 
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
        
          res.send({status: "error" , message : "Reset Password  link is not sent to your Mail. Please Check if you have entered a valid Email. For more details contact us at "+process.env.EMAIL});
        } else {
          res.send({status: "ok" , message : "Reset Password  link is Mailed Successfully. Please check your Email."} );
            
        
        }

        

      });
    
    }
    else{
      res.send({status:response.data.status, message: response.data.message});
    }
  }).catch(error => {

    res.json({ status: "error", message: "something went wrong " });
  });

});

app.get('/res_pass_num', (req, res) => {

  res.sendFile(view_dir_name + "/reset_pass_with_num.html");
});

app.get('/ver_reset_pass/:email/:t_name/:t_value', (req, res) => {

  let data = { email: req.params.email };
  data[req.params.t_name] = req.params.t_value;
 
  axios({
    method: 'post',
    url: process.env.API_URL + "/ver_reset_pass",
    data
  }).then(function (response) {
 
    if(response.data.status=="ok" ){
      let token = jwt.sign({ email: response.data.email,  token_str: response.data.token_str,token_no:response.data.token_no }, process.env.JWT_SECRET_KEY);
      res.cookie("rp", token, { expires: new Date(Date.now() + 6000000)} );
      if(req.params.t_name=="token_str"){
         res.sendFile(view_dir_name + "/reset.html");
      }else{
            res.send({status:"ok"})
      }
     
    }else{

      res.send(response.data);
    }
  }).catch(error => {
    res.json({ status: "error", message: "something went wrong " });
  });

});



app.get('/reset', (req, res) => {

  res.sendFile(view_dir_name + "/reset.html");
});

app.post('/new_pass', (req, res) => {
  
 let cookie_data = jwt.decode(req.cookies.rp);
 cookie_data.password = req.body.password; 


  
  axios({
    method: 'post',
    url: process.env.API_URL + "/new_pass",
    data:cookie_data
  }).then(function (response) {

    
      res.send(response.data);

  }).catch(error => {
    res.json({ status: "error", message: "something went wrong " });
  });

});



app.get('/test', (req, res) => {
  (async () => {
    const { body } = await got.get('www.youtube.com', {
      json: {
        hello: 'world'
      },
      responseType: 'json'
    });

    // => {hello: 'world'}
  })();

});





app.get("/*", (req, res) => {
  res.status(404).send({ "status": "error", message: "page not found from 1" })
})


app.listen(port, () => {
  console.log("listening at " + port);
});


