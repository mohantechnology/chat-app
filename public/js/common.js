socket.on("calling", (data) => {
    console.log("calling...");
    console.log( data )
    // user_id = data.id;
});

socket.on("redirect", ( data) => {
     
    console.log( "redirect") ;
    alert( "redirect") ; 

   
  });
// alert("common")