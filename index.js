
const express = require('express');
const app = express();
var  view_dir_name = __dirname + "/views"
app.use(express.static(__dirname + '/public'));
console.log(__dirname, '/views'); 
// app.set('views', (__dirname, '/views/'))

// const ver = require(__dirname+ "/model/email_verify"); 
// console.log(__dirname+ "/model/email_verify"); 


app.get('/', (req, res) => {

  res.sendFile(view_dir_name + "/home.html");
});

app.get('/login', (req, res) => {

  res.sendFile(view_dir_name + "/login.html");
});
app.get('/reg', (req, res) => {

  res.sendFile(view_dir_name + "/reg.html");
});
app.get('/forgot', (req, res) => {

  res.sendFile(view_dir_name + "/forgot.html");
});
app.get('/reset', (req, res) => {

  res.sendFile(view_dir_name + "/reset.html");
});


app.get('/test', (req, res) => {

  res.sendFile(view_dir_name + "/test.html");
});

app.get('/first-col.js', (req, res) => {

  res.sendFile(view_dir_name + "/first-col.js");
});


app.listen(3000, () => {
  console.log("listening at 3000");
});


