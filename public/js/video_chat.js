
var side_list_search_icon = document.getElementById("side-list-search-icon");
var camera_icon = document.getElementById("camera_icon");
var micropone_icon = document.getElementById("micropone_icon");
var call_but_text = document.getElementById("call_but_text");
var call_but = document.getElementById("call_but");
var join_but_text = document.getElementById("join_but_text");
var join_but = document.getElementById("join_but");
var remote_video_par_bx = document.getElementById("remote_video_par_bx");
var remote_vid_icon_bx = document.getElementById("remote_vid_icon_bx");

var local_video_par_bx = document.getElementById("local_video_par_bx");
var call_opt_bx = document.getElementById("call_opt_bx"); 


// socket.emit("sending_from_client", JSON.stringify({ data:  `this message is sned from client`} ) );

// // receive a message from the server
// socket.on("rec_from_server", ( data) => {
//   console.log(data )
// });

let remote_video = document.getElementById("remote_video");
let local_video = document.getElementById("local_video");
let localStream = null;
let peerConn;
let mediaConstraints = { video: { width: 1280, height: 720 }, audio: true };

const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
function add_tract_in_peer( ){ 
    console.log( localStream.getTracks( ) ) ; 
    // localStream.getTracks().forEach(track => peerConn.addTrack(track, localStream));
    peerConn.addStream( localStream);
}


async function getMedia() {

    try {
        //   constraints = mediaConstraints || {video : { width: 1280, height: 720 } , audio : true} ; 
        // constraints = mediaConstraints ; 
        let stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);;
        // console.log (   local_video.srcObject); 
        // console.log (   local_video); 
        // console.log ( stream); 
        localStream = stream;

        local_video.srcObject = null;
        local_video.srcObject = stream;
        local_video.onloadedmetadata = function (e) {
            // console.log("onloadedmetadata" )
            local_video.play();
        };
     return stream ; 

    }
    catch (err) {
        console.error(err);
        return false ; 
    }
}

async function startCall(e) {

    try {

        // let constraints = {video : { width: 1280, height: 720 } , audio : true} ; 
        // let stream = await navigator.mediaDevices.getUserMedia(constraints);  ; 
        // // console.log (   local_video.srcObject); 
        // // console.log (   local_video); 
        // // console.log ( stream); 
        // localStream = stream; 

        // local_video.srcObject = null; 
        // local_video.srcObject = stream; 
        // local_video.onloadedmetadata = function(e) {
        //     // console.log("onloadedmetadata" )
        //     local_video.play();
        //  };



        peerConn = new RTCPeerConnection(config);
        add_tract_in_peer()
        // peerConn.addStream(localStream);
        peerConn.onaddstream = (e) => {
            console.log("onaddStream");
            console.log(e);
            remote_video.srcObject = e.stream;
            // alert("onaddStream")
        }
        peerConn.onicecandidate = (e) => {
            console.log("onicecandidate");
            // console.log( e.candidate ); 
            if (e.candidate == null) {
                console.log("retunrning ");
                return;
            }
            console.log(" not retunrning ");
            socket.emit("store_candidate", e.candidate);
            // remote_video.srcObject= e.stream; 
            // socket.emit('signal', socketListId, JSON.stringify({ 'ice': e.candidate }))
        }

        createAndSendOffer();

        // console.log( peerConn); 


    }
    catch (err) {
        console.error(err);
    }
}



function createAndSendOffer() {
    console.log("createAndSendOffer")

    let f_id = getQueryVariable("f_id")
    if (!f_id) {
        console.log("friend not found.please reload the page ");
        return;
    }
    let li = getCookie("li");
    peerConn.createOffer(handleSuccess, handleError);
    function handleSuccess(offer) {
        console.log(offer);
        let data = { f_id: f_id, offer: offer, li:accessToken }
        socket.emit("store_offer", (data));
        peerConn.setLocalDescription(offer);
        // socket.emit("offer", id, peerConnection.localDescription);

    }

    function handleError(err) {
        console.log(err);

    }
}



// -----------------------------join call -----------------------



async function joinCall(e) {

    try {

        // let constraints = {video : false , audio : true} ; 
        // let constraints = { video: { width: 1280, height: 720 }, audio: true };
        // let stream = await navigator.mediaDevices.getUserMedia(constraints);;
        // // console.log (   local_video.srcObject); 
        // // console.log (   local_video); 
        // // console.log ( stream); 
        // localStream = stream;

        // local_video.srcObject = null;
        // local_video.srcObject = stream;
        // local_video.onloadedmetadata = function (e) {
        //     // console.log("onloadedmetadata" )
        //     local_video.play();
        // };



        peerConn = new RTCPeerConnection(config);
        add_tract_in_peer() ; 
        // peerConn.addStream(localStream);
        peerConn.onaddstream = (e) => {
            console.log("onaddStream");
            console.log(e);
            remote_video.srcObject = e.stream;
        }
        peerConn.onicecandidate = (e) => {
            console.log("onicecandidate");
            // console.log( e); 
            if (e.candidate == null) {
                console.log("retunrning ");
                return;
            }
            socket.emit("send_candidate", e.candidate);
            // remote_video.srcObject= e.stream; 
            // socket.emit('signal', socketListId, JSON.stringify({ 'ice': e.candidate }))
        }
        // socket.emit("send_candidate", e.candidate );
        // console.log( peerConn); 
        let li = getCookie("li");
 
        socket.emit('join_call',{ li :accessToken   });
        // createAndSendAnswer ()
    }
    catch (err) {
        console.error(err);
    }
}


function createAndSendAnswer() {
    console.log("createAndSendAnswer")
    peerConn.createAnswer(handleSuccess, handleError);
    function handleSuccess(answer) {
        console.log(answer);
        peerConn.setLocalDescription(answer);
        socket.emit("send_answer", answer);
        displayRemoteVideo() ; // for reciever
        // socket.emit("offer", id, peerConnection.localDescription);

    }

    function handleError(err) {
        console.log(err);

    }
}






function endCall() {

    let  input = confirm("Are you Sure you want to Leave this Call" ) ; 
    console.log( input)
    if( input == false ){ return ; }
    hideRemoteVideo(); 
    let li = getCookie("li");
        let data = {  li : accessToken } ; 
    socket.emit("end-call",data);
    window.location="/home" ; 
    console.log( "end-call")

}



// remote_video_par_bx.style.display="flex" ; 

function displayRemoteVideo ( ) { 
     console.log(  local_video_par_bx ) ; 
     console.log(  local_video_par_bx.classList ) ; 
     
    if( !local_video_par_bx.classList.contains("local-vid-bx-conn") ){ 
        local_video_par_bx.classList.add("local-vid-bx-conn" ) ; 
    }
    local_video_par_bx.style.zIndex = "200" ; 
    call_opt_bx.style.display = "none"; 
    local_vid_icon_bx.style.visibility = "hidden";  
    remote_video_par_bx.style.display="flex" ;
    remote_video_par_bx.style.zIndex="100" ;
     
        remote_vid_icon_bx.style.display="flex" ;
}

function hideRemoteVideo ( ) { 
     console.log(  local_video_par_bx ) ; 
     console.log(  local_video_par_bx.classList ) ; 
     
    if( local_video_par_bx.classList.contains("local-vid-bx-conn") ){ 
        local_video_par_bx.classList.remove("local-vid-bx-conn" ) ; 
    }
    call_opt_bx.style.display = "flex"; 
    local_vid_icon_bx.style.visibility = "visible";  
    remote_video_par_bx.style.display="none" ; 
    remote_vid_icon_bx.style.display="none" ; 
}

// ############### web socket  event ###################




socket.on("answer", (data) => {
    console.log("answer**")
    console.log(data)

    peerConn.setRemoteDescription(data); 
    displayRemoteVideo(); // for caller

});

socket.on("candidate", (data) => {
    console.log("candidate")
    console.log(data)
    peerConn.addIceCandidate(data)
    // alert( "addIceCandidate")


});


socket.on("take_offer", (offer) => {
    console.log("take_offer")
    console.log(offer)
    peerConn.setRemoteDescription(offer)
    createAndSendAnswer()

});

socket.on("friend-is-offline", (data) => {

    console.log("friend-is-offline");
    alert("Friend is Offline");


});

socket.on("not-friend", (data) => {

    console.log("not-friend");
    alert("this user is not in your friend list");


});

 
socket.on("call-decline",  () => {
    console.log("call-decline")
     alert( "Friend is Busy") ;
     if (call_but_text.textContent !== "Call" ) { 
            handleCall() 
  }
 
});
socket.on("call-ended",  () => {
    console.log("call-ended")
     alert( "Call Ended") ; 
    hideRemoteVideo(); // for caller 
     let f_id = getQueryVariable("f_id")
    window.location= "/video-chat?f_id="+f_id; 
});






camera_icon.addEventListener("click", (e) => {


    let classList = camera_icon.firstElementChild.classList;
    if (classList.contains("fa-video-slash")) {
        classList.remove("fa-video-slash");
        classList.add("fa-video");
        mediaConstraints.video = true;
        getMedia();
    }
    else {
        classList.remove("fa-video");
        classList.add("fa-video-slash");
        mediaConstraints.video = false;
        getMedia();
    }
})



micropone_icon.addEventListener("click", (e) => {


    let classList = micropone_icon.firstElementChild.classList;
    if (classList.contains("fa-microphone-slash")) {
        classList.remove("fa-microphone-slash");
        classList.add("fa-microphone");
        mediaConstraints.audio = false;
        getMedia();
    }
    else {
        classList.remove("fa-microphone");
        classList.add("fa-microphone-slash");
        mediaConstraints.audio = true;
        getMedia();
    }
})


function handleCall() {
    if (call_but_text.textContent == "Call") {
        call_but_text.textContent = "Calling...";
        // history.pushState("/profile"); 
        // history.forward(); 
        local_vid_icon_bx.style.visibility = "hidden"; 
        startCall(); 
    }
    else {
        call_but_text.textContent = "Call";
        local_vid_icon_bx.style.visibility = "visible"; 
    }

}


(async function () {

 
  
    if(  await getMedia( ) ){
        console.log( getQueryVariable("type")) ; 
        if( getQueryVariable("type") == "rec"){ 
    
            join_but.style.display = "inline-block"; 
            call_but.style.display = "none"; 
    
        }
        else{ 
            call_but.style.display = "inline-block"; 
            join_but.style.display = "none"; 
        }
    
    }else { 
        alert("Failed to get Media Access") ; 
        return; 
    }
     
    


  })();
