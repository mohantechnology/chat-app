require('dotenv').config();
 
const express = require('express');
 
const app = express();
 
const fileUpload = require('express-fileupload');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cookieParser());
app.use(express.static(__dirname + '/../public'));
 
app.use(bodyParser.json());
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors( { credentials: true}));

app.set('views', (__dirname, '/../views/'));
app.set("view engine", "hbs");
app.set("views", "views");

app.use(fileUpload({
  limits: { fileSize: 10000000 * 100000 },
}));

/*Initilize Routes */
require("./../routes")(app);

module.exports =app ; 