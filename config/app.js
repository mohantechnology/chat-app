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
const cors = require('cors')
const bodyParser = require('body-parser');
const { strict } = require('assert');
const { fips } = require('crypto');

// require('./database')();
// require('./socket')();

// app.use((req, res ,next)=>{
//   console.log ( req.headers); 
//   next(); 
// });
// app.all("/*", (req, res ,next)=>{
//   console.log ( req.headers); 
//   next(); 
// })

app.use(cookieParser());
app.use(express.static(__dirname + '/../public'));
// console.log(__dirname, '/views');
app.use(bodyParser.json());
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors( { credentials: true}));

app.set('views', (__dirname, '/../views/'))
app.set("view engine", "hbs");
app.set("views", "views")



app.use(fileUpload({
  limits: { fileSize: 10000000 * 100000 },
}));


/*Initilize Routes */
require("./../routes")(app);

module.exports =app ; 