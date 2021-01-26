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

const cookieParser = require("cookie-parser");

const bodyParser = require('body-parser');
const { strict } = require('assert');
const { fips } = require('crypto');
app.set('views', (__dirname, '/views/'))




var port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
console.log(__dirname, '/views');
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }))



app.set("view engine", "hbs");
app.set("views", "views")




app.use(fileUpload({
  limits: { fileSize: 10000000 * 100000 },
}));


console.log("socket url ="); 
console.log( process.env.SOCKET_URL); 
app.get("/", (req, res) => {
  // res.sendFile(__dirname + "/temp.html");
  return res.send(req.cookies.li); 
});




// transfer_file

app.post('/transfer_file/:curr_f_id/:file_mess?', function (req, res) {
  console.log(req.files); 

  let up_file; 
 

  // if file is present then  update the file in database also and delete prev file 
  if (req.files && req.files.transfer_file ) {

 let cookie_data = jwt.decode(req.cookies.li);
 cookie_data.file_name = req.files.transfer_file.name; 
 cookie_data.file_mess = req.params.file_mess; 
 cookie_data.curr_f_id =  req.params.curr_f_id; 
 cookie_data.mime_type = req.files.transfer_file.mimetype; 
 

    axios({
      method: 'post',
      url: process.env.API_URL + "/transfer_file",
      data: cookie_data
    }).then(function (response) {
      console.log("response data is: ");
      console.log(response.data);
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
            console.log("erro is: ", err.message)
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
      console.log("error is: ");
      console.log(err);
      res.status(500).send({ "status": "Internal server error" });

    }); 
  }else{
    res.send({status:"error",message:"File not present" }); 
  }

  });


  // transfer_file

app.get('/download/:folder/:file/:file_name?', function (req, res) {
  console.log(req.params); 
  


 
        let path_link =__dirname + `/public/transfer_file/${req.params.folder}/${req.params.file}`;
        // let path_link =__dirname + `/transfer_file`;
       
          if(req.params.file_name)
         {    
        res.download(path_link,req.params.file_name)
           }
       else{
          res.download(path_link)
       }
         
      
          //  console.log("File not present ")
          //   res.send({status:"error",message:"File not present" }); 
      
      
   


  });






// upload profile image 
app.post('/update_prof/:acc_tp?/:pro_mess?', function (req, res) {
  // console.log(req.files); 

  let up_file
  let cookie_data = jwt.decode(req.cookies.li);
  // if file is present then  update the file in database also and delete prev file 
  if (req.files) {
    up_file = req.files.myfile;
    cookie_data.is_file = 1;
    if (req.files.myfile) {
      cookie_data.file_name = req.files.myfile.name
    }
  } else {
    if(cookie_data)
    cookie_data.is_file = 0;
  }
  cookie_data.pro_mess = req.params.pro_mess;
  cookie_data.account_type = req.params.acc_tp;

  console.log("incoming cookie data", cookie_data);
  axios({
    method: 'post',
    url: process.env.API_URL + "/update_prof",
    data: cookie_data
  }).then(function (response) {
    console.log("response data is: ");
    console.log(response.data);
    if (response.data.status == "ok") {
      let r_data = (response.data);

      if (cookie_data.is_file == 1) {

        let sampleFile = req.files.myfile;
        sampleFile.mv(__dirname + '/public/img/profile/' + r_data.curr_file_name, function (err) {
          if (err) {
            console.log("erro is: ", err.message)
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
    console.log("error is: ");
    console.log(err);
    res.status(500).send({ "status": "Internal server error" });
  });




console.log("file is : ", req.files);
console.log("req.body is: ", req.body);
console.log("req.params is: ", req.params);
console.log("req.cookies is: ", req.cookies);

  // let sampleFile = req.files.myfile;
  // sampleFile.mv(__dirname + '/upload/' + sampleFile.name, function (err) {
  //   if (err) {
  //     console.log("erro is: ", err.message)
  //     return res.status(500).send(err);
  //   }
  //   else {
  //     res.send('File uploaded!');
  //   }
  // })
});

app.post("/image", (req, res) => {
  console.log("./imgae cllaed ")
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send("Something went wrong!");
      console.log(err);
      console.log(req.file);
    }
    console.log(req.files, req.file);
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
    console.log(response.data);
    if (response.data.status == "ok") {

      
      let token = jwt.sign({ email: response.data.email, name: response.data.name, u_id: response.data.u_id, token: response.data.token, p_id: response.data.p_id }, process.env.JWT_SECRET_KEY);
      res.cookie("li", token, { expires: new Date(Date.now() + 6000000),sameSite:"strict"} );
      console.log("cookie encodded", token);
      console.log("succesfull set cookie ", jwt.decode(token));
      res.send({ "status": "ok" });

    }
    else {
      res.send(response.data);
    }
  }).catch(err => {
    console.log("error is: ");
    console.log(err);
    res.status(500).send({ "status": "Internal server error" });
  });

  // res.send(view_dir_name + "/login.html");
});






app.get('/profile', (req, res) => {



  let cookie_data = jwt.decode(req.cookies.li);
console.log("incoming cookie data", cookie_data);
  if( !(cookie_data) || !(cookie_data.u_id)){
    console.log("redirecting"); 
   return  res.redirect("./login"); 
    
  }
  
  axios({
    method: 'post',
    url: process.env.API_URL + "/profile",
    data: cookie_data
  }).then(function (response) {
    console.log("response data is: ");
    console.log(response.data);
    if (response.data.status == "ok") {
      let r_data = (response.data);
      r_data.SOCKET_URL = process.env.SOCKET_URL;
      r_data.SOCKET_FILE = process.env.SOCKET_FILE;
      res.render("home", r_data);


    }
    else {
      res.send(response.data);
      

    }
  }).catch(err => {
    console.log("error is: ");
    console.log(err);
    res.status(500).send({ "status": "Internal server error" });
  });


});


app.get('/find_friend', (req, res) => {
  res.sendFile(view_dir_name + "/find_friend.html");
});

app.post('/find_friend', (req, res) => {



  let cookie_data = jwt.decode(req.cookies.li);
  if (cookie_data) {
    cookie_data.search_value = req.body.search_value;
  }

  console.log("incoming cookie data from find-friend ", cookie_data, req.body);
  axios({
    method: 'post',
    url: process.env.API_URL + "/find_friend",
    data: cookie_data
  }).then(function (response) {
    console.log(response.data);
    res.send(response.data);
  }).catch(err => {
    console.log("error is: ");
    console.log(err);
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

  console.log("incoming cookie data from send_friend_request", cookie_data);
  axios({
    method: 'post',
    url: process.env.API_URL + "/send_friend_request",
    data: cookie_data
  }).then(function (response) {
    console.log(response.data);
    res.send(response.data);
  }).catch(err => {
    console.log("error is: ");
    console.log(err);
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

  console.log("incoming cookie data from accept_friend_request", cookie_data);
  axios({
    method: 'post',
    url: process.env.API_URL + "/accept_friend_request",
    data: cookie_data
  }).then(function (response) {
    console.log(response.data);
    res.send(response.data);
  }).catch(err => {
    console.log("error is: ");
    console.log(err);
    res.status(500).send({ "status": "Internal server error" });
  });


});


app.post('/fetch_friend', (req, res) => {



  let cookie_data = jwt.decode(req.cookies.li);
  if (cookie_data) {
    cookie_data.friend_u_id = req.body.friend_u_id;
    cookie_data.date = req.body.date;
    cookie_data.time = req.body.time;

  }

  console.log("incoming cookie data from fetch_friend", cookie_data);
  axios({
    method: 'post',
    url: process.env.API_URL + "/fetch_friend",
    data: cookie_data
  }).then(function (response) {
    console.log(response.data);
    res.send(response.data);
  }).catch(err => {
    console.log("error is: ");
    console.log(err);
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

  console.log("incoming cookie data from fetch_friend", cookie_data);
  axios({
    method: 'post',
    url: process.env.API_URL + "/fetch_remain",
    data: cookie_data
  }).then(function (response) {
    console.log(response.data);
     
    res.send(response.data);
  }).catch(err => {
    console.log("error is: ");
    console.log(err);
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

  console.log("incoming cookie data from display_noti", cookie_data);
  axios({
    method: 'post',
    url: process.env.API_URL + "/display_noti",
    data: cookie_data
  }).then(function (response) {
    console.log(response.data);
    res.send(response.data);
  }).catch(err => {
    console.log("error is: ");
    console.log(err);
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

  console.log("incoming cookie data from send_friend_request", cookie_data);
  axios({
    method: 'post',
    url: process.env.API_URL + "/send_friend_request",
    data: cookie_data
  }).then(function (response) {
    console.log(response.data);
    res.send(response.data);
  }).catch(err => {
    console.log("error is: ");
    console.log(err);
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
    console.log("register response")
    console.log(response.data);
    if(response.data.status=="ok" && response.data.message=="Acount Registered Successfully"){
      console.log('sendign "email "'); 
      res.send(response.data)
    }else{
       res.send(response.data);
    }
   
  }).catch(error => {
    res.json({ status: "error", message: "something went wrong " });
  });

});



app.get('/active', (req, res) => {
  console.log("activate file is sent ")
 res.sendFile(view_dir_name + "/activate.html")

});



app.get('/activate/:email/:t_name/:t_value', (req, res) => {
  console.log("incoming data at actiavte app ", req.params);
  let data = { email: req.params.email };
  data[req.params.t_name] = req.params.t_value;
  console.log("ingoing  data at actiavte app ", data);
  axios({
    method: 'post',
    url: process.env.API_URL + "/activate",
    data
  }).then(function (response) {
    console.log(response.data);
    res.send(response.data);
  }).catch(error => {
    res.json({ status: "error", message: "something went wrong " });
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





app.get("/*", (req, res) => {
  res.status(404).send({ "status": "error", message: "page not found from 1" })
})



// require('crypto').randomBytes(48, function(err, buffer) {
//   var token = buffer.toString('hex');
// });
// var token = crypto.randomBytes(64).toString('hex');
app.listen(port, () => {
  console.log("listening at " + port);
});


