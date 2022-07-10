"use strict";
// var is_user_connected  = false ; // store if user has successfully created session with socket server or not 
var set_interval_timeid;

// socket.on("calling", (data) => {
//   // user_id = data.id;
// });

socket.on("redirect", () => {

  alert( "redirect") ; 

});

socket.on("connection-sucess", () => {
  clearInterval(set_interval_timeid);
});

window.addEventListener("load", () => {

  set_interval_timeid = setInterval(make_session_with_socket, 1000);
 
});

function make_session_with_socket() {
  let sid = getCookie("sid");
  if (!sid) {
     
    console.warn("sid not found ");
  }
  let cookie_data = { sid };
  socket.emit("user-connected", cookie_data);

}

// alert("common")