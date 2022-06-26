"use strict"
const app = require('./config/app');
// const constant = require('./Utils/constant.js');
const fs = require('fs');
require('./config/database')();
require('./config/socket')();

 

var port = process.env.PORT || 3000;


// var cors_opt = {
//   origin:"https://php-file-api.000webhostapp.com/transfer_file.php"
// }
 

app.all("/*", (req, res) => {
  res.status(404).send({ "status": "error", message: "page not found from 1" })
})



app.listen(port, () => {
  console.log("listening at " + port);
});


