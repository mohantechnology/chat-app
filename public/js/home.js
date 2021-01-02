
const socket = io('http://localhost:8000');

// const socket = io('https://socket-event-hadler.herokuapp.com/');

// var  name = prompt("enter your name");
var  name = ['maggi', 'mohan', 'manp', 'mango', 'splic', 'taste', 'bhatman'];
name = name[(Date.now()) % name.length];


var  mess_bd = document.getElementById("message-body");
var  side_list_search_icon = document.getElementById("side-list-search-icon");
var  side_list_up_icon = document.getElementById("side-list-up-icon");
var  side_list_down_icon = document.getElementById("side-list-down-icon");
var  side_list_close_icon = document.getElementById("side-list-close-icon");

var  side_list_search_count = document.getElementById("side-list-search-count");
//  var  name = prompt("enter your name ");
var  myform = document.getElementById("myform");

var  message_input = document.getElementById("message_input");
var  input_search_keyword = document.getElementById("input-search-keyword");
var  side_list_curr_pos = 0;
var  child_arr_pos = [];
var  menu = document.getElementById("menu");
var  menu_box = document.getElementById("menu-box");
var  menu_close = document.getElementById("menu_close");
var  noti_box = document.getElementById("noti_box");
var noti = document.getElementById("noti"); 
var rec_req =document.getElementById("rec_req"); 
var req_box =document.getElementById("req_box"); 
var  ping_audio = new Audio("ping.mp3")

//stackoverflow function 
function selectElementText(el, win) {
win = win || window;
var doc = win.document, sel, range;
if (win.getSelection && doc.createRange) {
sel = win.getSelection();
range = doc.createRange();
range.selectNodeContents(el);
sel.removeAllRanges();
sel.addRange(range);
} else if (doc.body.createTextRange) {
range = doc.body.createTextRange();
range.moveToElementText(el);
range.select();
}
}



function make_element_for_friend_req(data) {


    return  `<div class="friend-profile">
     <div class="friend-image">
         <img src="${data.sender_img} " alt="profile-image">
     </div>
     <span class="profile  noti-profile">
         <p class="user-name">${data.sender_name} </p>
         <p class="user-time">${data.sender_pro_mess} </p>
 
     </span>
     <div id='${ data.sender_p_id }' class="send-request-but">Accept Request</div>
 
 </div>`; 
 
  }


//display all recived request 
rec_req.addEventListener("click",()=>{
    menu_box.style.display="none"; 
    // message_body.style.display="none"; 
    //TODO

    let xhttp = new XMLHttpRequest();


    xhttp.open("POST", "./accept_friend_request", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
            let data = JSON.parse(this.response);
            console.log(data);
            if (data.status == "ok") {
               let len = data.data.length; 
               let html_str = ""; 
               for(let i=0 ; i<len; i++){
                   html_str += make_element_for_friend_req(data.data[i]); 

               }
                 
               req_box.innerHTML = html_str; 
               
                  console.log(data);
                  console.log(req_box.innerHTML);  
            //     // console.log(html_str);
            //     e.target.innerHTML= "Added as Friend";
            //   //   console.log(e.target.className); 
            //     e.target.className="sended-request-but"; 
            // } else {
            //     console.log("error occured");
            //     console.log(data);
               
            }
            ;
        }
    }
    let param = "signal=0&date="+ (new Date().toLocaleDateString())+"&time="+(new Date().toLocaleTimeString());
 
//  let param = "p_id=" + id+ "&date="+ (new Date().toLocaleDateString())+"&time="+(new Date().toLocaleTimeString());
    xhttp.send(param);


})

req_box.addEventListener("click",(e)=>{

    // message_body.style.display="none"; 
    //TODO

    if(e.target.textContent=="Accept Request"){

        let xhttp = new XMLHttpRequest();
        let id=e.target.id; 

        xhttp.open("POST", "./accept_friend_request", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
                let data = JSON.parse(this.response);
                console.log(data);
                if (data.status == "ok") {
                   let len = data.data.length; 
                   let html_str = ""; 
                   for(let i=0 ; i<len; i++){
                       html_str += make_element_for_friend_req(data.data[i]); 
    
                   }
                     
                   req_box.innerHTML = html_str; 
                   
                      console.log(data);
                      console.log(req_box.innerHTML);  
                //     // console.log(html_str);
                //     e.target.innerHTML= "Added as Friend";
                //   //   console.log(e.target.className); 
                //     e.target.className="sended-request-but"; 
                // } else {
                //     console.log("error occured");
                //     console.log(data);
                   
                }
                ;
            }
        }
        // let param = "signal=" + 0+ "&date="+ (new Date().toLocaleDateString())+"&time="+(new Date().toLocaleTimeString());
     
     let param =  "signal=1&p_id=" + id+ "&date="+ (new Date().toLocaleDateString())+"&time="+(new Date().toLocaleTimeString());
        xhttp.send(param);
    

    }
 

})


//display
noti.addEventListener("click",()=>{
    menu_box.style.display="none"; 
    // message_body.style.display="none"; 
    //TODO

    let xhttp = new XMLHttpRequest();


    xhttp.open("POST", "./display_noti", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
            let data = JSON.parse(this.response);
            console.log(data);
            if (data.status == "ok") {
            
             
            //     // console.log(html_str);
            //     e.target.innerHTML= "Added as Friend";
            //   //   console.log(e.target.className); 
            //     e.target.className="sended-request-but"; 
            // } else {
            //     console.log("error occured");
            //     console.log(data);
               
            }
            ;
        }
    }
 let param = "p_id=" + id+ "&date="+ (new Date().toLocaleDateString())+"&time="+(new Date().toLocaleTimeString());
    xhttp.send(param);


})



 





noti_box.addEventListener("click",(e)=>{

    //if Accept request is clicked 
    if(e.target.className =="send-request-but"){
      let id=e.target.id; 
      console.log(id); 
      let xhttp = new XMLHttpRequest();


      xhttp.open("POST", "./accept_friend_request", true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
              let data = JSON.parse(this.response);
              console.log(data);
              if (data.status == "ok") {
              
               
                  // console.log(html_str);
                  e.target.innerHTML= "Added as Friend";
                //   console.log(e.target.className); 
                  e.target.className="sended-request-but"; 
              } else {
                  console.log("error occured");
                  console.log(data);
                 
              }
              ;
          }
      }
   let param = "p_id=" + id+ "&date="+ (new Date().toLocaleDateString())+"&time="+(new Date().toLocaleTimeString());
      xhttp.send(param);

    } 
})




menu_close.addEventListener("click",()=>{
    menu_box.style.display="none"; 
}); 

menu.addEventListener("click",()=>{
    menu_box.style.display="block"
}); 


side_list_down_icon.addEventListener("click", () => {
if (child_arr_pos.length > 0) {
    side_list_curr_pos = (side_list_curr_pos + 1) % child_arr_pos.length;
    let src_id = document.getElementById(child_arr_pos[side_list_curr_pos]);
    side_list_search_count.textContent = (side_list_curr_pos + 1) + "/" + child_arr_pos.length;
    // src_id.focus();

    src_id.style.color = "red";
   
    mess_bd.scrollTop = src_id.offsetTop - 20;
    selectElementText(src_id);
    // src_id.scrollIntoView();

}
console.log("clickde");

});


side_list_up_icon.addEventListener("click", () => {
if (child_arr_pos.length > 0) {


    // console.log(src_id.style.color=="");
    // if(side_list_curr_pos ==0 && )
    side_list_curr_pos = (side_list_curr_pos + child_arr_pos.length - 1) % child_arr_pos.length;
    let src_id = document.getElementById(child_arr_pos[side_list_curr_pos]);
    side_list_search_count.textContent = (side_list_curr_pos + 1) + "/" + child_arr_pos.length;
    src_id.style.color = "red";
    // src_id.setPointerCapture();
    // src_id.selectionStart =5;
    // src_id.focus(); 
    mess_bd.scrollTop = src_id.offsetTop - 20;
    selectElementText(src_id);
// selectElementText(elementInIframe, iframe.contentWindow);


    // src_id.style.scrol
    //  src_id.scrollIntoView();
    // mess_bd.scrollTop =  src_id.scrollTo(10)
    // mess_bd.children[1].clientHeight;
    //  ;
    // src_id.offsetTop
    // console.log(src_id.parentElement.parentElement.offsetTop); 
    // console.log( src_id.parentElement.parentElement.scrollHeight);
    // console.log(mess_bd.scrollTop = src_id.offsetTop); 

}
console.log("clickde");

});
side_list_search_icon.addEventListener("click", () => {
side_list_search_icon.style.display = "none";
side_list_down_icon.style.display = "inline-block";
side_list_up_icon.style.display = "inline-block";
side_list_close_icon.style.display = "inline-block";
input_search_keyword.value = "";

});
side_list_close_icon.addEventListener("click", () => {
side_list_search_icon.style.display = "inline-block";
side_list_down_icon.style.display = "none";
side_list_up_icon.style.display = "none";
side_list_close_icon.style.display = "none";
side_list_search_count.style.display = "none";

let src_id;
for (let i = 0; i < child_arr_pos.length; i++) {
    src_id = document.getElementById(child_arr_pos[i]);
    if (src_id != null) {

        console.log(src_id);
        // if(src_id != ) 
        src_id.parentNode.innerHTML = src_id.parentNode.textContent;
    }


}
// console.log(document.getElementById(child_arr_pos[i]).parentNode.textContent);
// src_elem.parentNode.textContent = ;
//    mess_bd.children[i].firstElementChild.innerHTML = set_color_to_text(mess_bd.children[i].firstElementChild.textContent, search_value, mess_bd.children[i]);


child_arr_pos = [];
side_list_curr_pos = 0;
input_search_keyword.textContent = "";
input_search_keyword.value = "";


});


socket.emit("new-user-connected", { "name": name });


document.getElementById("sub_button").addEventListener("click", () => {
socket.emit('send-specific-client');
})










function set_color_to_text(text, patt_str = "", element_id) {





let last, result;
let len1, len2;
let index;
let count = 0;
len2 = patt_str.length;


len1 = text.length;
if (patt_str == "" || text == "" || len2 > len1) {
    return text;
}
let text_str = text.toLowerCase();

patt_str = patt_str.toLowerCase();
result = "";
last = index = 0;

while (true) {
    index = text_str.indexOf(patt_str, last);

    if (index != -1) {
        result += text.slice(last, index) + '<span class="search-item-bg" id=search-item-bg-' + child_arr_pos.length + '>' + text.slice(index, index + len2) + '</span>';
        last = index + len2;


        child_arr_pos.push('search-item-bg-' + child_arr_pos.length);
    }
    else {
        break;
    }

}

result += text.slice(last, len1);
return result


//         str1 = str1.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
//         search_value = search_value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
//         console.log("initia string filter "); 
//         console.log(search_value); 
//         let  reg_ex = new RegExp(search_value, "ig");

//         console.log("reg x is: "); 
//         console.log(reg_ex); 
//         str1 = str1.replace(reg_ex, '<span class="search-item-bg">' + search_value + '</span>');
//         console.log("strng 1 is: "); 
//         console.log(str1); 



//        let  len = str1.length;
//        let  str2 = "";
//        let  count = 0;
//        let j =0; 
//         for ( j = 0; j < len; j++) {
//             if (str1[j] == "\\") {
//                 j++;

//             }
//             str2+= str1[j];
//         }


//         console.log("ans  2 is: "); 
//         console.log(str2); 
//         console.log("-----------------"); 
//    return str2; 
}

input_search_keyword.addEventListener("keyup", (e) => {

side_list_search_icon.style.display = "none";
side_list_down_icon.style.display = "inline-block";
side_list_up_icon.style.display = "inline-block";
side_list_close_icon.style.display = "inline-block";
side_list_search_count.style.display = "inline-block";
child_arr_pos = [];


side_list_curr_pos = 0;
let search_value = input_search_keyword.value;
// string.charCodeAt(0);
let no_of_child = mess_bd.children.length;
let str1 = "";
let str2 = "";
let len = 0;
let i = 0;
let count = 0;

for (let i = 0; i < no_of_child; i++) {
    if (mess_bd.children[i].firstElementChild != null) {


        mess_bd.children[i].firstElementChild.innerHTML = set_color_to_text(mess_bd.children[i].firstElementChild.textContent, search_value, mess_bd.children[i]);


        mess_bd.children[i].lastElementChild.innerHTML = set_color_to_text(mess_bd.children[i].lastElementChild.textContent, search_value, mess_bd.children[i]);

    }

}
console.log(child_arr_pos.length);
if (child_arr_pos.length > 0) {
    side_list_search_count.textContent = (side_list_curr_pos + 1) + "/" + child_arr_pos.length;
    //  child_arr_pos[0].scrollIntoView();
    //mess_bd.children[0].scrollIntoView();

    // document.getElementById(child_arr_pos[0]).scrollIntoView();rgb(208, 177, 177)
    side_list_down_icon.style.color = "rgb(255,255,255)";
    side_list_close_icon.style.color = "rgb(255,255,255)";
    side_list_up_icon.style.color = "rgb(255,255,255)";
    side_list_search_count.style.color = "rgb(255,255,255)";
    mess_bd.scrollTop = document.getElementById(child_arr_pos[0]).offsetTop - 20;

}
else {
    side_list_search_count.textContent = "0/0";
    side_list_down_icon.style.color = "rgb(214, 204, 250)";
    side_list_close_icon.style.color = "rgb(214, 204, 250)";
    side_list_up_icon.style.color = "rgb(214, 204, 250)";
    side_list_search_count.style.color = "rgb(214, 204, 250)";

}


});



function set_scroll_to_bottom(id) {
if (id) {
    id.scrollTop = id.scrollHeight;
}
}



myform.addEventListener("submit", (e) => {
e.preventDefault();
let curr_time = (new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
socket.emit('message-sent', { "message": message_input.value, "time": curr_time });

let temp1 = document.createElement("div");
temp1.classList = "message left";
let temp2 = document.createElement("span");


if (message_input.value.trim() == "") {
    temp2.innerHTML = "&nbsp;";
} else {
    temp2.textContent = message_input.value;
}

temp2.classList = "message-left";
temp1.appendChild(temp2);
temp2 = document.createElement("span");
temp2.textContent = curr_time;
temp2.classList = "message-time-left";
temp1.appendChild(temp2);
mess_bd.appendChild(temp1);



message_input.value = "";
console.log(message_input.value);
set_scroll_to_bottom(mess_bd);
});


socket.on("new-user-connected", (data) => {
console.log("new user in client ");

// <div class="message middle">
//                 <span class="message-middle">
//                     This is middle line

//                 </span>
//             </div>
let temp1 = document.createElement("div");
temp1.classList = "message middle";
let temp2 = document.createElement("span");
temp2.textContent = data + " Joined the Chat ";
temp2.classList = "message-middle";
temp1.appendChild(temp2);
mess_bd.appendChild(temp1);

set_scroll_to_bottom(mess_bd);
});


socket.on("user-disconnected", (data) => {
console.log("new user in client ");


let temp1 = document.createElement("div");
temp1.classList = "message middle";
let temp2 = document.createElement("span");
temp2.textContent = data + " leave the Chat ";
temp2.classList = "message-middle";
temp1.appendChild(temp2);
mess_bd.appendChild(temp1);

set_scroll_to_bottom(mess_bd);
});

socket.on("message-recived", (data) => {
console.log("data recied  ");
console.log(data);

let temp1 = document.createElement("div");
temp1.classList = "message right";
let temp2 = document.createElement("span");

if (data.message.trim() == "") {
    temp2.innerHTML = "&nbsp;";
} else {
    temp2.textContent = data.message;
}


temp2.classList = "message-right";
temp1.appendChild(temp2);
temp2 = document.createElement("span");
temp2.textContent = data.time;
temp2.classList = "message-time-right";
temp1.appendChild(temp2);
mess_bd.appendChild(temp1);
ping_audio.currentTime = 0;
ping_audio.play();

set_scroll_to_bottom(mess_bd);



});

socket.on("user-disconnected", (data) => {
console.log("new user in client ");


let temp1 = document.createElement("div");
temp1.classList = "message middle";
let temp2 = document.createElement("span");
temp2.textContent = data + " leave the Chat ";
temp2.classList = "message-middle";
temp1.appendChild(temp2);
mess_bd.appendChild(temp1);

set_scroll_to_bottom(mess_bd);
});

socket.on("recieved-pecific-client", (data) => {

console.log(data);
set_scroll_to_bottom(mess_bd);



});











console.log("data is: ); "); 
// console.log({{status}}); 
