socket.on("calling", (data) => {
    console.log("calling...");
    console.log( data )
    // user_id = data.id;
});

socket.on("redirect", ( data) => {
     
    console.log( "redirect") ;
    alert( "redirect") ; 

   
  });


  window.addEventListener('load', (e) => {
    console.log('page is fully loaded');

    let data = document.cookie.split(";")
    let cookie_data = {};
    let temp;
    for (let i = 0; i < data.length; i++) {
        temp = data[i].split("=");
        cookie_data[temp[0].trim()] = temp[1];
    }

    // console.log(cookie_data);
    socket.emit("user-connected", cookie_data);

});


// alert("common")