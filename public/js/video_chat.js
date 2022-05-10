 
var side_list_search_icon = document.getElementById("side-list-search-icon");
 
 
// socket.emit("sending_from_client", JSON.stringify({ data:  `this message is sned from client`} ) );

// // receive a message from the server
// socket.on("rec_from_server", ( data) => {
//   console.log(data )
// });

let remote_video = document.getElementById("remote_video"); 
let local_video = document.getElementById("local_video"); 
let localStream = null; 
let peerConn ; 


const config = {iceServers: [{urls: "stun:stun.l.google.com:19302"}]};

 async function startCall (e) { 

    try { 
     
        let constraints = {video : { width: 1280, height: 720 } , audio : true} ; 
        let stream = await navigator.mediaDevices.getUserMedia(constraints);  ; 
        // console.log (   local_video.srcObject); 
        // console.log (   local_video); 
        // console.log ( stream); 
        localStream = stream; 

        local_video.srcObject = null; 
        local_video.srcObject = stream; 
        local_video.onloadedmetadata = function(e) {
            // console.log("onloadedmetadata" )
            local_video.play();
         };
     


         peerConn = new RTCPeerConnection( config) ; 

    peerConn.addStream( localStream); 
    peerConn.onaddstream= (e)=>{ 
        console.log( "onaddStream"); 
        console.log( e); 
        remote_video.srcObject= e.stream; 
    }
    peerConn.onicecandidate= (e)=>{ 
        console.log( "onicecandidate"); 
        // console.log( e.candidate ); 
        if( e.candidate == null) { 
            console.log( "retunrning " ) ; 
            return; 
        }
        console.log( " not retunrning " ) ; 
        socket.emit("store_candidate", e.candidate );
        // remote_video.srcObject= e.stream; 
        // socket.emit('signal', socketListId, JSON.stringify({ 'ice': e.candidate }))
    }

    createAndSendOffer( ); 

    // console.log( peerConn); 


    } 
    catch( err){ 
        console.error( err) ; 
    }
 } 

 

 function createAndSendOffer () { 
    console.log( "createAndSendOffer")

    let f_id = getQueryVariable("f_id")
    if(!f_id ){ 
        console.log("friend not found.please reload the page "); 
        return;  
    }
    let li =  getCookie("li")  ; 
    peerConn.createOffer( handleSuccess, handleError) ; 
    function handleSuccess( offer){
        console.log( offer); 
        let data = { f_id : f_id , offer : offer , li}
        socket.emit("store_offer", (  data ) );
        peerConn.setLocalDescription( offer) ;
        // socket.emit("offer", id, peerConnection.localDescription);
     
    }
   
        function handleError( err){
        console.log( err); 
 
    }
 }



 // -----------------------------join call -----------------------

 
 
 async function joinCall (e) { 

    try { 
     
        // let constraints = {video : false , audio : true} ; 
        let constraints = {video : { width: 1280, height: 720 } , audio : true} ; 
        let stream = await navigator.mediaDevices.getUserMedia(constraints);  ; 
        // console.log (   local_video.srcObject); 
        // console.log (   local_video); 
        // console.log ( stream); 
        localStream = stream; 

        local_video.srcObject = null; 
        local_video.srcObject = stream; 
        local_video.onloadedmetadata = function(e) {
            // console.log("onloadedmetadata" )
            local_video.play();
         };
     


         peerConn = new RTCPeerConnection( config) ; 

    peerConn.addStream( localStream); 
    peerConn.onaddstream= (e)=>{ 
        console.log( "onaddStream"); 
        console.log( e); 
        remote_video.srcObject= e.stream; 
    }
    peerConn.onicecandidate= (e)=>{ 
        console.log( "onicecandidate"); 
        // console.log( e); 
        if( e.candidate == null) { 
            console.log( "retunrning " ) ; 
            return; 
        }
        socket.emit("send_candidate", e.candidate );
        // remote_video.srcObject= e.stream; 
        // socket.emit('signal', socketListId, JSON.stringify({ 'ice': e.candidate }))
    }
    // socket.emit("send_candidate", e.candidate );
    // console.log( peerConn); 
    socket.emit('join_call', {}) ; 
    // createAndSendAnswer ()
    } 
    catch( err){ 
        console.error( err) ; 
    }
 } 


 function createAndSendAnswer () { 
    console.log( "createAndSendAnswer")
    peerConn.createAnswer( handleSuccess, handleError) ; 
    function handleSuccess( answer){
        console.log( answer); 
        peerConn.setLocalDescription( answer) ;
        socket.emit("send_answer", answer );
        // socket.emit("offer", id, peerConnection.localDescription);
     
    }
   
        function handleError( err){
        console.log( err); 
 
    }
 }






 function endCall( ) { 
    socket.emit("end-call" );
 }



 // ############### web socket  event ###################



 socket.on("answer", ( data) => {
    console.log("answer**" )
    console.log(data )

    peerConn.setRemoteDescription(data)
   
  });

  socket.on("candidate", ( data) => {
    console.log("candidate" )
    console.log(data )
    peerConn.addIceCandidate(data)
   
  });
  

  socket.on("take_offer", ( offer) => {
    console.log("take_offer" )
    console.log(offer )
    peerConn.setRemoteDescription(offer)
    createAndSendAnswer()
   
  });

  socket.on("friend-is-offline", ( data) => {
     
    console.log( "friend-is-offline") ;
    alert( "friend-is-offline") ; 

   
  });

  socket.on("not-friend", ( data) => {
     
    console.log( "not-friend") ;
    alert( "this user is not in your friend list") ; 

   
  });

  