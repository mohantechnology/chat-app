"use strict" ;

var mess_bd = document.getElementById("message-body");
var side_list_search_icon = document.getElementById("side-list-search-icon");
var side_list_up_icon = document.getElementById("side-list-up-icon");
var side_list_down_icon = document.getElementById("side-list-down-icon");
var side_list_close_icon = document.getElementById("side-list-close-icon");

var side_list_search_count = document.getElementById("side-list-search-count");
 
var myform = document.getElementById("myform");

var message_input = document.getElementById("message_input");
var input_search_keyword = document.getElementById("input-search-keyword");
var side_list_curr_pos = 0;
var child_arr_pos = [];
var menu = document.getElementById("menu");
var menu_box = document.getElementById("menu-box");
var menu_close = document.getElementById("menu_close");
var noti_box = document.getElementById("noti_box");
var noti = document.getElementById("noti");
var rec_req = document.getElementById("rec_req");
var req_box = document.getElementById("req_box");
var sett_box = document.getElementById("sett_box");
var search_keyword_alias = document.getElementById("search_keyword_alias");
var loader = document.getElementById("loader"); 
var setting = document.getElementById("setting");
var incoming_call_bx = document.getElementById("incoming_call_bx");

var all_id = {};
var upload_list = {};
var incoming_call_data ; 
//-----------------first col 

var col_1 = document.getElementById("col-1");
var col_2 = document.getElementById("col-2");
var first_col_friend_list = document.getElementById("first-col-friend-list");
var first_col_input_box = document.getElementById("first-col-input-box");
var first_col_close_icon = document.getElementById("first-col-close-icon");
var first_col_search_icon = document.getElementById("first-col-search-icon"); 
var header_name = document.getElementById("header_name");

var close_search = document.getElementById("close_search");
var close_noti = document.getElementById("close_noti");
var close_req = document.getElementById("close_req");
var close_sett = document.getElementById("close_sett");
var prof_img = document.getElementById("prof_img");
var self_prof = document.getElementById("self_prof");
var update_but = document.getElementById("update_but");
var upload_file = document.getElementById("upload_file");
var upload_but = document.getElementById("upload_but");
var log_out = document.getElementById("log_out");
var send_file = document.getElementById("send_file");
var transfer_file = document.getElementById("transfer_file");
var display_file = document.getElementById("display_file");
var drop_box = document.getElementById("drop_box");
var close_file_upload = document.getElementById("close_file_upload");

var find_new_friend = document.getElementById("find_new_friend");
var account_type_pub = document.getElementById("account_type_pub");
var account_type_pri = document.getElementById("account_type_pri");

var prof_mess = document.getElementById("prof_mess");
var mess_tone_off = document.getElementById("mess_tone_off");
var mess_tone_on = document.getElementById("mess_tone_on");
var mess_tone = localStorage.getItem("mess_tone") ? localStorage.getItem("mess_tone") : "on";
var back = document.getElementById("back");
var forward = document.getElementById("forward");
var m_q = window.matchMedia("(max-width: 950px)");
var drop_file = document.getElementById("drop_file");
var select_file = document.getElementById("select_file");
var browse_file = document.getElementById("browse_file");
var side_list_video_cam = document.getElementById("side-list-video-cam");

var message_list = {};
var d_img_url = "../default_img.png";
var d_mess = "Hello, I am using chat app";

var user_id;
var curr_f_id;
var is_recieved = true;
var is_recieved_noti = true;
var is_recieved_reqest = true;
var prev_f_id;
var ping_audio = new Audio("ping.mp3");
var is_redirecting = false; 
var current_message_page = undefined; // store last index till message listed  

if( localStorage.getItem("ln") !="1"  ){
  location = "./login"; 
}

document.cookie = "date=" + (new Date().toLocaleDateString()) + "; path=/;";
document.cookie = "time=" + (new Date().toLocaleTimeString()) + "; path=/;";

m_q.addEventListener("change", () => {

  if (m_q.matches) { // If media query matches

    if (col_1.style.display == "inline-block") {
      forward.style.display = "inline-block";
      back.style.display = "none";
      col_2.style.display = "none";
    } else {
      back.style.display = "inline-block";
      forward.style.display = "none";
      col_1.style.display = "none";
      col_2.style.display = "inline-block";

    }
    search_keyword_alias.style.display = "block";
    input_search_keyword.parentNode.style.display = "none";
   
  } else {

    col_1.style.display = "inline-block";
    col_2.style.display = "inline-block";
    forward.style.display = "none";
    back.style.display = "none";

    if (close_search.style.display == "inline-block") {
      // input_search_keyword.parentNode.style.display = "none";
      search_keyword_alias.style.display = "none";
      input_search_keyword.parentNode.style.display = "inline-block";
      header_name.children[0].style.display = "inline-block";
      header_name.children[1].style.display = "inline-block";
      header_name.children[2].style.display = "none";

      close_search.style.display = "none";
      menu.style.display = "inline-block";

    } else {
      search_keyword_alias.style.display = "none";
      input_search_keyword.parentNode.style.display = "inline-block";

    }
  }

});

search_keyword_alias.addEventListener("click", () => {
  input_search_keyword.parentNode.style.display = "inline-block";
  search_keyword_alias.style.display = "none";
  header_name.children[0].style.display = "none";
  header_name.children[1].style.display = "none";
  header_name.children[2].style.display = "none";
  menu_box.style.display = "none";
  close_search.style.display = "inline-block";
  menu.style.display = "none";
});

close_file_upload.addEventListener("click", () => {
  drop_box.style.display = "none";
  mess_bd.style.display = "block";
  select_file.style.display = "inline-block";
  send_file.style.display = "none";
  display_file.innerHTML = "";
  transfer_file.files = null;

});

close_search.addEventListener("click", () => {
  input_search_keyword.parentNode.style.display = "none";
  search_keyword_alias.style.display = "block";
  header_name.children[0].style.display = "inline-block";
  header_name.children[1].style.display = "inline-block";
  header_name.children[2].style.display = "inline-block";
  close_search.style.display = "none";
  menu.style.display = "inline-block";

});

side_list_video_cam.addEventListener("click", () => {
 
  //  localStorage.setItem("curr_f_id",curr_f_id )
  is_redirecting= true ; //set it true so that session data should not delete from server
  window.location= "/video-chat?f_id="+curr_f_id; 
  // window.location= "/video-chat"

});

function make_file_sent_element(data) {
   
  let temp = document.createElement("div");
  let mime_type = "";
  if (!data.message) {
    data.message = "";
  }
  if (data.mimeType) {
    mime_type = data.mimeType.split("/")[0];
 
    if (mime_type == "image") {
      mime_type = `background-image:url('/upload/transferFile/${data.fileName}');min-height: 200px;`;

    }
  }
  if (data.message) {
    data.message = `<span class="download-img-mess download-img-mess-send">${data.message}</span>`;
  } else {
    data.message = "";
  }
  //   let download_link = `./download/${data.folder_name}/${data.file_link}`
 
  if (data.createdBy == "friend") {
    temp.classList = "message right";
    temp.innerHTML = `   
           <span class="message-right file-right">
          <div class="message-file">
            <div class="download-img-display" style="${mime_type}" ></div>
            ${data.message} 
</span><div class="file-name"> ${data.fileName}</div> 
              <span class="download-img" id="${data.fileName}"> </span>
              <span class="share-img"> </span>
         
          </div>
        </span>
                  <span class="message-time-left">${data.time}</span>`;

  }

  else if (data.createdBy == "self") {
    temp.classList = "message left";
    temp.innerHTML = `
          <span class="message-left file-left">
          <div class="message-file">
            <div class="download-img-display"  style="${mime_type}" > </div>
            ${data.message} 
            <div class="file-name">  ${data.fileName}</div> 
              <span class="download-img" id="${data.fileName}" > </span>
              <span class="share-img"> </span>
         
          </div>
        </span>

          <span class="message-time-left">${data.time}</span>`;

  }
  else {

    temp.classList = "message middle";
    temp.innerHTML = `       <span class="message-middle">  ${data.message}   </span> `;
  }

  return temp;
}

// mess_bd.append(make_file_upload_element({time:"34/34/3402" ,message:"kdjfldsjf" ,direction:"out"})); 

function make_file_upload_element(data) {

  let temp = document.createElement("div");

  if ((!data.message) || data.message == "") {
    data.message = "&nbsp;";
  }
  data.message = data.message.trim();

  temp.classList = "message left";

  temp.innerHTML = `   <span class="message-left file-left">file shareng
          <div class="message-file">
            <span class="download-img-mess"> ${data.file_name}
           
              <hr>   Uploading... <br>
            <div class="load_box" id="${data.upload_id}">
            
              <span class="percent">0%</span>
              <span class="byte"> ${data.byte}</span>
              <div class="loading-body"> </div>
              <div class="loading"></div>
            </div>
          </div>
        </span>
       `;

  return temp;
}

function make_message_element(data) {

  let temp = document.createElement("div");
  data.message = data.message.trim();
  if (data.message == "") {
    data.message = "&nbsp;";
  }

  if (data.createdBy == "friend") {
    temp.classList = "message right";
    temp.innerHTML = `    <span class="message-right">${data.message}</span>
          <span class="message-time-right">${ new Date(data.date ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'  }) }</span>  `;

  }
  else if (data.createdBy == "self") {
    temp.classList = "message left";
    temp.innerHTML = `
          <span class="message-left">${data.message}
          </span>
          <span class="message-time-left">${ new Date(data.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }</span>`;

  }
  else {
    temp.classList = "message middle";
    temp.innerHTML = `       <span class="message-middle">  ${data.message}  </span> `;
  }

  return temp;
}

mess_bd.addEventListener("scroll",async () => { 

  if (is_recieved && mess_bd.scrollTop < 800 && current_message_page  && curr_f_id) {
    is_recieved = false;
    loader.style.display = "block";
 
    let url = `./list_message?page=${current_message_page ++ }&limit=20&friendUserId=${curr_f_id}` ; 
    
    try{
      let response = await sendRequest.get(url ) ; 
      response = JSON.parse( response ) ; 
      
      display_message_data( response.data); 
      is_recieved = true; 
      loader.style.display = "none"; 
    }
    catch( err){
      console.error( err) ; 
    }

  }

});

mess_bd.addEventListener("click", (e) => {
  if (e.target.className == "download-img") { 
    let path = e.target.id;
    let url = "./download_file?fileName=" +path ;
    
    var elel = document.createElement("a");
    elel.setAttribute("href", url);
    // elel.setAttribute("download", "true");
    elel.setAttribute("target", "_blank");
    elel.click();
     
  }

});

back.addEventListener("click", () => {
  col_1.style.display = "block";
  col_2.style.display = "none";
  forward.style.display = "inline-block";
});

forward.addEventListener("click", () => {
  col_1.style.display = "none";
  col_2.style.display = "inline-block";
  back.style.display = "inline-block";
});

close_noti.addEventListener("click", () => {
  close_noti.parentNode.style.display = "none";
  noti_box.style.display = "none";
  header_name.style.display = "block";
});
close_req.addEventListener("click", () => {
  close_req.parentNode.style.display = "none";
  req_box.style.display = "none";
  header_name.style.display = "block";
});
close_sett.addEventListener("click", () => {
  close_sett.parentNode.style.display = "none";
  sett_box.style.display = "none";
  header_name.style.display = "block";
});

upload_but.addEventListener("click", () => {
  upload_file.click();

});

function preview_img() {
  self_prof.children[0].children[0].style.backgroundImage = prof_img.style.backgroundImage = `url('${URL.createObjectURL(upload_file.files[0])}')`;

  prof_img.onload = function () {
    URL.revokeObjectURL(prof_img.src); // free memory
    URL.revokeObjectURL(self_prof.src); 
  };

}
function byte_to_unit(size) {
  if (size <= 1000) return { divi: 1, unit: "B" };
  if (size <= 100000) return { divi: 1000, unit: "KB" };
  if (size <= 100000000) return { divi: 1000000, unit: "MB" };
  if (size <= 100000000000) return { divi: 1000000000, unit: "GB" };
  if (size <= 100000000000000) return { divi: 1000000000000, unit: "TB" };

}

log_out.addEventListener("click", async() => { 
  let cookie_arr = document.cookie.split(";");
  for (let i = 0; i < cookie_arr.length; i++) {
    let temp = `${cookie_arr[i].split("=")[0]}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; `;
 
    document.cookie = temp;

  }
  try {
  
    await sendRequest.post ( "" , "/logout", "application/json"  );
    // response = JSON.parse(response);
     
  }
  catch (err) {
    console.error(err);
  }

  localStorage.removeItem("ln"); 
   
  location = "./login";
});

function transfer_file_to_friend(e) {

  let total_file;
 
  if (transfer_file.files && transfer_file.files.length > 0) {
    total_file = transfer_file.files.length;
  } else {
    console.error("no file ");
    select_file.style.display = "inline-block";
    send_file.style.display = "none";
    return;

  } 
  //    stack overflow
  let f_id = curr_f_id;
  let file_mess = message_input.value;
  message_input.value = "";

  // let data = document.cookie.split(";")

  // let temp;
  // let param = ""; 
  // for (let i = 0; i < data.length; i++) {
  //     temp = data[i].split("=");
  //     param+=  "&" + temp[0].trim() +"=" + temp[1]; 

  // }

  for (let i = 0; i < total_file; i++) {
    //generate upload id 

    let upload_id = f_id + parseInt(Math.random() * 10000);

    while (all_id[upload_id]) {
      upload_id = f_id + parseInt(Math.random() * 10000);
    }
    all_id[upload_id] = true;
    let size_detail = byte_to_unit(transfer_file.files[i].size);
    size_detail.size = transfer_file.files[i].size;
    size_detail.final_size = Math.round(size_detail.size * 100 / size_detail.divi) / 100 + " " + size_detail.unit;
    let form_data = new FormData();
    form_data.append("uploadFile", transfer_file.files[i]);

    let xhttp = new XMLHttpRequest();
    // let url = `/transfer_file/${f_id}/${encodeURIComponent(file_mess)}`;
    // let url = `${FILE_TRANSFER_URL}?f_id=${f_id}&file_mess=${encodeURIComponent(file_mess)} ${param}`;
    let url = '/upload_file'; 
    xhttp.open("POST", url, true);
 
    xhttp.upload.onprogress = function (e) {
      let element = document.getElementById(upload_id);
      if (element) {
        let frac = e.loaded / e.total;
      
        element.children[0].innerText = Math.round(frac * 100) + "%";
        element.children[1].innerText = Math.round(e.loaded * 100 / size_detail.divi) / 100 + "/" + Math.round(e.total * 100 / size_detail.divi) / 100 + size_detail.unit;
        element.children[2].style.width = Math.round(frac * 100) + "%";
        element.children[3].style.width = Math.round(frac * 95) + "%";
     
      }

    };

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4  ) {
        
        let res_data = JSON.parse(this.response);
                
        if (this.status >= 200 && this.status < 300) {
          let data = res_data.data ; 
          data.message = file_mess;
          data.time = (new Date()).toLocaleTimeString();
          data.date = Date.now() ; 
          data.curr_f_id = f_id;
          data.messageType = "file";
          // data.user_id = user_id;
          data.createdBy = "self";

          socket.emit('send-message', data);

          if (curr_f_id == f_id) {
            document.getElementById(upload_id).parentNode.parentNode.parentNode.parentNode.remove();
            mess_bd.append(make_file_sent_element(data));
            set_scroll_to_bottom(mess_bd);
          } else {

            if (message_list[f_id] != undefined) {

              message_list[f_id].push(res_data);
            } else {
              message_list[f_id] = [res_data];
            }
          }
          // let upload_len = upload_list[f_id].length; 
          // for(let j=0; j<upload_len; j++){
          //      if(upload_list[f_id][j][upload_id]){
          //         upload_list[f_id] =  upload_list[f_id].splice(j,1); 

          //      }

          // }
          delete upload_list[f_id][upload_id];
        
        }
        else {
          console.error(res_data.error);
        }

      }
    };

    // let arr = [{name: "maggi",age:234},{name: "yes ",age:234}]
    // arr.search({name:"maggi",age:234}) 
    xhttp.send(form_data);
    let upload_data = { file_name: (transfer_file.files[i].name), byte: "waiting...", upload_id: upload_id };
    let upload_detail = {};
    upload_detail[upload_id] = upload_data;
    let temp_child = make_file_upload_element(upload_data);
   
    mess_bd.append(temp_child);

    if (upload_list[f_id]) {
      upload_list[f_id][upload_id] = upload_data;
    } else {
      upload_list[f_id] = upload_detail;
    }
    set_scroll_to_bottom(mess_bd);
  }

}
function make_element_for_display_file(file_name) {
  let temp = document.createElement("div");
  temp.className = "drop-file";
  temp.innerHTML = ` <img  class="drop-file-img" src="./file-earmark-check.svg" alt="file"> <span class="drop-file-name" > ${file_name}</span>`;
  return temp;
}
// ##    myform.submit(); 
send_file.addEventListener("click", (e) => {
  transfer_file_to_friend(e);
  display_file.innerHTML = "";
  mess_bd.style.display = "block";
  drop_box.style.display = "none";
  transfer_file.files = null;
  send_file.style.display = "none";
  select_file.style.display = "inline-block";

});
browse_file.addEventListener("click", () => {
  transfer_file.click();
});
// drop file and upload 

select_file.addEventListener("click", () => {
  mess_bd.style.display = "none";
  drop_box.style.display = "block";
  drop_file.style.display = "block";
  select_file.style.display = "none";
  send_file.style.display = "inline-block";

});

transfer_file.addEventListener("change", () => {
  // if(transfer_file.files && transfer_file.files.length>0){

  // }
  // drop_box.style.display="none";
  display_file.innerHTML = "";
  drop_file.style.display = "none";
 
  for (let i = 0; i < transfer_file.files.length; i++) {
    display_file.append(make_element_for_display_file(transfer_file.files[i].name));
   
  }

});
drop_file.addEventListener("dragover", (e) => {
  e.preventDefault();
  
  drop_file.parentElement.style.backgroundColor = "rgba(212, 175, 204, 0.719)";
  drop_file.lastElementChild.style.transform = "scale(1.3)";

});

drop_file.addEventListener("dragleave", (e) => {
 
  drop_file.parentElement.style.backgroundColor = "rgb(216, 175, 207)";
  drop_file.lastElementChild.style.transform = "scale(1)";

});

drop_file.addEventListener("drop",  (e) => {
  e.preventDefault();
  drop_file.style.display = "none";

  if (curr_f_id) {
    display_file.innerHTML = "";
    transfer_file.files = e.dataTransfer.files;
    for (let i = 0; i < transfer_file.files.length; i++) {
      display_file.append(make_element_for_display_file(transfer_file.files[i].name));
     
    }
    // transfer_file_to_friend(e); 
  }
  
});

//profile image file 
update_but.addEventListener("click", async (e) => {
  let up_file = upload_file.files[0];

  //    stack overflow

  let form_data = new FormData();

  if (update_but.innerText == "Update") {
    if( up_file){ 
      form_data.append("profileImg", up_file); 
    }
    form_data.append("accountType", account_type_pub.checked == true ? "public" : "private");
    form_data.append("profMess",(prof_mess.value));
    form_data.append("messageTone", mess_tone_off.checked ? "off": "on");
        
    update_but.innerText = "Updating...";

    try {
           
      // let param =  ({ friendUserId: id }) ; 
     
      let response = await sendRequest.post ( form_data , "/update_profile", null, {isSetHeader : false}  ); 
      JSON.parse(response);
      
      // update_but.innerText = "Updated";
      update_but.innerText = "Update";
      window.location.reload()  ; 
      // e.target.className = "sended-request-but";
    }
    catch (err) {
      update_but.innerText = "Not Updated";

      console.error(err);
    }

  }

});

first_col_close_icon.addEventListener("click", () => {
  first_col_input_box.value = "";
  first_col_search_icon.style.display = "inline-block";
  first_col_close_icon.style.display = "none";

  let children = first_col_friend_list.children;
  let len = children.length;
  for (let i = 1; i < len; i++) {

    children[i].style.display = "inline-block";

  }
  children[0].style.display = "none";
});

first_col_input_box.addEventListener("keyup", () => {
  let search_value = first_col_input_box.value.toLocaleLowerCase();

  let flag = 0;

  let children = first_col_friend_list.children;
  let len = children.length;

  if (search_value == "") {
    first_col_search_icon.style.display = "inline-block";
    first_col_close_icon.style.display = "none";

  }
  else {
    first_col_search_icon.style.display = "none";
    first_col_close_icon.style.display = "inline-block";
  }

  for (let i = 1; i < len; i++) {
    if (children[i].children[1].children[0].textContent.toLocaleLowerCase().search(search_value) != -1) {
      children[i].style.display = "inline-block";
      flag = 1;
    }
    else if (children[i].children[1].children[1].textContent.toLocaleLowerCase().search(search_value) != -1) {
      children[i].style.display = "inline-block";
      flag = 1;
    }
    else {
      children[i].style.display = "none";
    }
  }
  if (flag) {
    children[0].style.display = "none";
  }
  else {
    children[0].style.display = "inline-block";
  }

});

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

  // check if profile image exists and if start with https or not 
  let profileImgPath =  data.profileImg ? 
    data.profileImg.startsWith("https://") ?  data.profileImg : "/upload/" +  data.profileImg 
    : "./img/profile/"+  d_img_url  ; 

  return `<div class="friend-profile">
     <div class="friend-image">

     <span class="all_img"
     style="background-image: url('${profileImgPath}');">
 </span>
     
     </div>
     <span class="profile  noti-profile">
         <p class="user-name">${data.name} </p>
         <p class="user-time">${data.profMess ? data.profMess : d_mess} </p>
 
     </span>
     <div id='${data.uId}' class="send-request-but">Accept Request</div>
 
 </div>`;

}
//##start here @########## fot notifcation 

function make_element_for_noti(data) {
  // check if profile image exists and if start with https or not 
  let profileImgPath =  data.profileImg ? 
    data.profileImg.startsWith("https://") ?  data.profileImg : "/upload/" +  data.profileImg 
    : "./img/profile/"+  d_img_url  ; 

  return `    <div class="friend-profile">
                    <div class="friend-image">
                    <span class="all_img"
                    style="background-image: url('${profileImgPath}');">
                </span>
                    
                    </div>
                    <span class="profile  noti-profile">
                        <p class="user-name">${data.name}</p>
                        <p class="user-time">${data.profMess ? data.profMess : "Hello, I am using chat app"} </p>

                    </span>
                    <div class="noti-mess">${data.message}
                    </div>

                </div>`;

}

function display_message_data (data){ 
  try{ 

    /* handle unreaded message */  
    if(data.unreaded && data.unreaded.length   ){ 
      for (let i = data.unreaded.length - 1; i >= 0; i--) { 
        if (data.unreaded[i].messageType == "text" || data.readed[i].messageType == undefined) {
          mess_bd.prepend(make_message_element(data.unreaded[i]));
        } else {
    
          mess_bd.prepend(make_file_sent_element(data.unreaded[i]));
        }
    
      }
      /* create one message of 'unreaded message'  */  
      let curr_elem_data = { messageType: "server", message: "unreaded messages (" + data.unreaded.length  + ")" };
      mess_bd.prepend(make_message_element(curr_elem_data)); 
            
    }
    
    /* handle readed message */ 
    if(data.readed && data.readed.length   ){ 
      for (let i = data.readed.length - 1; i >= 0; i--) { 
        if (data.readed[i].messageType == "text" || data.readed[i].messageType == undefined ) {
          mess_bd.prepend(make_message_element(data.readed[i]));
        } else { 
          mess_bd.prepend(make_file_sent_element(data.readed[i]));
        } 
      }
    }
  }
  catch (err){
    console.error( err) ; 
  }

}

//fetch friend chat message 
first_col_friend_list.addEventListener("click", async (e) => {

  if( e.target.className == "side-list"){ 
    return; 
  }

  select_file.style.display = "inline-block";
  send_file.style.display = "none";
  drop_box.style.display = "none";
  close_noti.parentNode.style.display = "none";
  close_req.parentNode.style.display = "none";
  close_sett.parentNode.style.display = "none";
  noti_box.style.display = "none";
  myform.style.display = "block";
  mess_bd.style.display = "block";
  header_name.style.display = "block";
  side_list_video_cam.style.display = "inline-block"; 
  /* hide all other boxes */
  menu_box.style.display = "none";
  sett_box.style.display = "none";
  noti_box.style.display = "none";

  let id;
  if (e.target.id) { id = e.target.id; }
  else if (e.target.parentNode.id) { id = e.target.parentNode.id; }
  else if (e.target.parentNode.parentNode.id) { id = e.target.parentNode.parentNode.id; }
 
  document.cookie = "date=" + (new Date().toLocaleDateString()) + "; path=/;";
  document.cookie = "time=" + (new Date().toLocaleTimeString()) + "; path=/;";

  if (id && curr_f_id != id) { 
    if (m_q.matches) {
      col_1.style.display = "none";
      col_2.style.display = "inline-block";
      back.style.display = "inline-block";

    }

    loader.style.display="inline-block"; 
    current_message_page = 1;
    document.cookie = "curr_f_id=" + (id) + "; path=/;";
    mess_bd.innerHTML = "";
    menu_box.style.display = "none";

    prev_f_id = curr_f_id;
    socket.emit("connected-to", { prev_f_id: prev_f_id, curr_f_id: id, u_id: user_id });
    curr_f_id = id;

    let total_mess_len = message_list[id] ? message_list[id].length : 0;

    let url = `./list_message?page=${current_message_page++}&limit=20&friendUserId=${id}&friendProfile=yes` ; 
  
    try{
      let response = await sendRequest.get(url ) ; 
      response = JSON.parse( response ); 
     
      let data = response.data; 

      display_message_data( data);

      header_name.children[0].children[0].style.backgroundImage = document.getElementById(id).children[0].children[0].style.backgroundImage;  // copy image from friend list column
      header_name.children[1].children[0].textContent = data.friendProfile.name;
      header_name.children[1].children[1].textContent = data.friendProfile.currentStatus;
      loader.style.display="none"; 
      is_recieved = true; 

      document.getElementById(id).children[0].children[1].classList.add("not-visible"); // hide message count ; 
    
      mess_bd.scrollTop = mess_bd.scrollHeight;
    
    }
    catch( err){
      console.error( err) ; 
    }
  
  } else if (id && m_q.matches) { 
    // for smaller width  update the incoming stored messages
    col_1.style.display = "none";
    col_2.style.display = "inline-block";
    back.style.display = "inline-block";
    let total_mess_len = message_list[id] ? message_list[id].length : 0;
    let temp_messages ;
    if (total_mess_len != 0) {
      temp_messages = message_list[id]; 
      message_list[id] = []; 
      let elem = { direction: "ser", message: "unreaded messages (" + total_mess_len + ")" };
      mess_bd.append(make_message_element(elem));

      if (temp_messages[0].messageType) {
        mess_bd.append(make_file_sent_element(temp_messages[0]));
      } else {
        mess_bd.append(make_message_element(temp_messages[0]));
      }
     
      for (let i = 1; i < total_mess_len; i++) {
       
        if (temp_messages[i].messageType) {
        
          mess_bd.append(make_file_sent_element(temp_messages[i]));
        } else {
         
          mess_bd.append(make_message_element(temp_messages[i]));
        }

      }

    }
    document.getElementById(id).children[0].children[1].classList.add("not-visible");

    //    append the uploading files  list to mess_bd 
    let upload_obj = upload_list[curr_f_id];
    if (upload_obj) {
      let upload_arr = Object.values(upload_obj);
      for (let i = 0; i < upload_arr.length; i++) {
        mess_bd.append(make_file_upload_element(upload_arr[i]));
        
      }

    }

  }

});

find_new_friend.addEventListener("click", () => {
  location = "./find_friend";
});

noti.addEventListener("click", async () => {

  if (is_recieved_noti) {
    is_recieved_noti = false;
    loader.style.display = "inline-block";
    menu_box.style.display = "none";
    mess_bd.style.display = "none";
    noti_box.style.display = "block";
    close_noti.parentNode.style.display = "block";
    header_name.style.display = "none";
    myform.style.display = "none";
    //TODO
        
    try { 

      let response = await sendRequest.get( "./list_notifi") ;
      response = JSON.parse(response);
      
      let notifi_list = response.data ; 
    
      let html_str = "";
 
      if (notifi_list.length) {
        notifi_list.map((item) => {
          html_str += make_element_for_noti(item);
        });
      }
      else {
        html_str = `<div class="friend-profile"><span class="profile">
                <p class="user-time">&nbsp;</p>
                <p class="user-name">No New Notifications</p>
                <p class="user-time">&nbsp;</p> </span></div>`;
      }
      
      loader.style.display = "none";
      noti_box.innerHTML = html_str;
      is_recieved_noti = true; 
    }
    catch (err) {
      console.error(err);
    }

  }

});

//display  profile setting 
setting.addEventListener("click", async() => {
 
  menu_box.style.display = "none";
  mess_bd.style.display = "none";
  sett_box.style.display = "block";
  close_sett.parentNode.style.display = "block";
  header_name.style.display = "none";
  myform.style.display = "none";
  loader.style.display = "inline-block";
  try {
    // let html_str = ""; 
    let response = await sendRequest.get( "./profile") ;
    response = JSON.parse(response);
    
    let data = response.data ; 
 
    loader.style.display = "none";
    if( data.accountType ==  "public"  ){ 
      account_type_pub.checked = true;  
    }else{ 
      account_type_pri.checked = true; 
    } 

    if (data.messageTone ==  "on" ) {
      mess_tone_on.checked = true;
    } else {
      mess_tone_off.checked = true;
    }
    prof_mess.value = data.profMess ; 

  }
  catch (err) {
    console.error(err);
  }

});

//display all recived request 
rec_req.addEventListener("click", async  () => {

  if (is_recieved_reqest) {
    is_recieved_reqest = false;
    loader.style.display = "inline-block";

    menu_box.style.display = "none";
    mess_bd.style.display = "none";
    noti_box.style.display = "block";
    close_req.parentNode.style.display = "block";
    header_name.style.display = "none";
    // message_body.style.display="none"; 
    //TODO

    mess_bd.style.display = "none";
    noti_box.style.display = "none";
    req_box.style.display = "block";
    //  header_name.style.display="none"
    myform.style.display = "none";

    try {
      let html_str = ""; 
      let response = await sendRequest.get( "./list_rec_request") ;
      response = JSON.parse(response);
     
      let rec_req_list  = response.receivedRequest ; 
        
      if (rec_req_list.length) {
        rec_req_list.map((item) => {
          html_str += make_element_for_friend_req(item);
        });
      }
      else {
        html_str = `<div class="friend-profile"><span class="profile">
                <p class="user-time">&nbsp;</p>
                <p class="user-name">No Received Request Found</p>
                <p class="user-time">&nbsp;</p> </span></div>`;
      }
      loader.style.display = "none";
      req_box.innerHTML = html_str;
      is_recieved_reqest = true;

    }
    catch (err) {
      console.error(err);
    }

  }
});

req_box.addEventListener("click", async (e) => {
 
  noti_box.style.display = "none";
  req_box.style.display = "block";
  
  if (e.target.textContent == "Accept Request") {

    try {
      let id = e.target.id;
      if( !id ) { return ; }
      let param = JSON.stringify ({ friendUserId: id }) ; 
     
      e.target.innerHTML == "Processing..." ; 
      let response = await sendRequest.post ( param , "/accept_friend_req", "application/json"  );
      response = JSON.parse(response); 
      e.target.innerHTML= "Added as Friend";

    }
    catch (err) {
      console.error(err);
    }

  }

});

noti_box.addEventListener("click", (e) => {

  //if Accept request is clicked 
  noti_box.style.display = "block";
  req_box.style.display = "none";
  if (e.target.className == "send-request-but") {
    let id = e.target.id; 
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", "./accept_friend_request", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
        let data = JSON.parse(this.response);
        
        if (data.status == "ok") {
 
          e.target.innerHTML = "Added as Friend";
         
          e.target.className = "sended-request-but";
        }
        else {
          console.error("error occured");

        }
        
      }
    };
    let param = "p_id=" + id + "&date=" + (new Date().toLocaleDateString()) + "&time=" + (new Date().toLocaleTimeString());
    xhttp.send(param);

  }
});

menu_close.addEventListener("click", () => {
  menu_box.style.display = "none";
});

menu.addEventListener("click", () => {
  menu_box.style.display = "block";
});
function click_side_list_down_icon() {
  if (child_arr_pos.length > 0) {
    side_list_curr_pos = (side_list_curr_pos + 1) % child_arr_pos.length;
    let src_id = document.getElementById(child_arr_pos[side_list_curr_pos]);
    side_list_search_count.textContent = (side_list_curr_pos + 1) + "/" + child_arr_pos.length;
     
    src_id.style.color = "red";
  
    let temp_class_name  = src_id.parentElement.parentElement.className; 
    if (temp_class_name == "message-file") {
      mess_bd.scrollTop = src_id.parentElement.parentElement.offsetTop - 20;
    }else if( temp_class_name =="message right" || temp_class_name =="message left" ){
      mess_bd.scrollTop  = src_id.parentElement.parentElement.offsetTop-20 ;
    }
    else {
      mess_bd.scrollTop = src_id.offsetTop - 20;
    }
    selectElementText(src_id);

  }
}

side_list_down_icon.addEventListener("click", () => {
  click_side_list_down_icon();

});

side_list_up_icon.addEventListener("click", () => {
  if (child_arr_pos.length > 0) {
 
    side_list_curr_pos = (side_list_curr_pos + child_arr_pos.length - 1) % child_arr_pos.length;
    let src_id = document.getElementById(child_arr_pos[side_list_curr_pos]);
    side_list_search_count.textContent = (side_list_curr_pos + 1) + "/" + child_arr_pos.length;
    src_id.style.color = "red";
 
    let temp_class_name  = src_id.parentElement.parentElement.className; 
    if (temp_class_name == "message-file") {
      mess_bd.scrollTop = src_id.parentElement.parentElement.offsetTop - 20;
    }else if( temp_class_name =="message right" || temp_class_name =="message left" ){
      mess_bd.scrollTop  = src_id.parentElement.parentElement.offsetTop-20 ;
    }
    else {
      mess_bd.scrollTop = src_id.offsetTop - 20;
    }
    selectElementText(src_id);

  }

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
 
      src_id.parentNode.innerHTML = src_id.parentNode.textContent;
    }

  }
  
  child_arr_pos = [];
  side_list_curr_pos = 0;
  input_search_keyword.textContent = "";
  input_search_keyword.value = "";

});

function set_color_to_text(text, patt_str = "", element_id = null) {

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

  // eslint-disable-next-line no-constant-condition
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
  return result;
   
}

input_search_keyword.addEventListener("keyup", (e) => {

  if (e.key == "Enter" || e.keyCode == 13) { 
    click_side_list_down_icon();
    return;
  }

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
  // let str1 = "";
  // let str2 = "";
  // let len = 0;
  // let i = 0;
  // let count = 0;
  let c_name;
  let temp_curr_child ; 
  for (let i = 0; i < no_of_child; i++) {
    c_name = mess_bd.children[i].firstElementChild.className;

    if (c_name == "message-left" || c_name == "message-right") {

      mess_bd.children[i].firstElementChild.innerHTML = set_color_to_text(mess_bd.children[i].firstElementChild.textContent, search_value, mess_bd.children[i]);

      mess_bd.children[i].lastElementChild.innerHTML = set_color_to_text(mess_bd.children[i].lastElementChild.textContent, search_value, mess_bd.children[i]);

    }

    else if ((temp_curr_child = mess_bd.children[i].children[0]) && temp_curr_child.firstElementChild && temp_curr_child.firstElementChild.className == "message-file") {
      if (temp_curr_child.firstElementChild.children.length == 5) {
        //file mess    
        temp_curr_child.firstElementChild.children[1].innerHTML = set_color_to_text(temp_curr_child.firstElementChild.children[1].textContent, search_value, mess_bd.children[i]);
        //file name  
        temp_curr_child.firstElementChild.children[2].innerHTML = set_color_to_text(temp_curr_child.firstElementChild.children[2].textContent, search_value, mess_bd.children[i]);
      } else if (temp_curr_child.firstElementChild.children.length == 4) {
        //file name 
        temp_curr_child.firstElementChild.children[1].innerHTML = set_color_to_text(temp_curr_child.firstElementChild.children[1].textContent, search_value, mess_bd.children[i]);
      }

    }

  }
  // ### 
  if (child_arr_pos.length > 0) {
    side_list_search_count.textContent = (side_list_curr_pos + 1) + "/" + child_arr_pos.length;

    side_list_down_icon.style.color = "rgb(255,255,255)";
    side_list_close_icon.style.color = "rgb(255,255,255)";
    side_list_up_icon.style.color = "rgb(255,255,255)";
    side_list_search_count.style.color = "rgb(255,255,255)";
    let src_id = document.getElementById(child_arr_pos[0]);
    let temp_class_name  = src_id.parentElement.parentElement.className; 
    if (temp_class_name == "message-file") {
      mess_bd.scrollTop = src_id.parentElement.parentElement.offsetTop - 20;
    }else if( temp_class_name =="message right" || temp_class_name =="message left" ){
      mess_bd.scrollTop  = src_id.parentElement.parentElement.offsetTop-20 ;
    }
    else {
      mess_bd.scrollTop = src_id.offsetTop - 20;
    }
    // selectElementText(src_id);

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
  // return if input message is for file
  if (drop_box.style.display == "block") { 
    return;
  }
  if( message_input.value ==""){
    return ; 
  }
  let curr_time = (new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  socket.emit('send-message', { "message": message_input.value, date: Date.now(), curr_f_id: curr_f_id, user_id: user_id });

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

  set_scroll_to_bottom(mess_bd);
});

message_input.addEventListener("focusin", () => {
  socket.emit("typing", { curr_f_id: curr_f_id, u_id: user_id });
});

message_input.addEventListener("focusout", () => {
  socket.emit("not-typing", { curr_f_id: curr_f_id, u_id: user_id });
});

// window.onload = confirmExit;
// window.onbeforeunload = confirmExit;
// function confirmExit() {
//     document.cookie = "date=" + (new Date().toLocaleDateString()) + "; path=/;";
//     document.cookie = "time=" + (new Date().toLocaleTimeString()) + "; path=/;";

// }
 
// ----- socket --------------

// 
// window.addEventListener('load', (e) => {
//     console.log('page is fully loaded');

//     let data = document.cookie.split(";")
//     let cookie_data = {};
//     let temp;
//     for (let i = 0; i < data.length; i++) {
//         temp = data[i].split("=");
//         cookie_data[temp[0].trim()] = temp[1];
//     }

//     // console.log(cookie_data);
//     socket.emit("user-connected", cookie_data);

// });

window.addEventListener("beforeunload", function (e) {

  document.cookie = "date=" + (new Date().toLocaleDateString()) + "; path=/;";
  document.cookie = "time=" + (new Date().toLocaleTimeString()) + "; path=/;"; 
  let data = document.cookie.split(";");
  let cookie_data = {};
  let temp;
  for (let i = 0; i < data.length; i++) {
    temp = data[i].split("=");
    cookie_data[temp[0].trim()] = temp[1];
  }
  alert( is_redirecting); 
  if( is_redirecting==false){ 
    socket.emit("user-disconnect", cookie_data);
  }

}, false);

col_2.style.display = "inline-block"; 
if (m_q.matches) {
  col_1.style.display = "inline-block";
  col_2.style.display = "none";
}

// socket.on("new-user-connected", (data) => {
// console.log("new user in client ");

// // <div class="message middle">
// //                 <span class="message-middle">
// //                     This is middle line

// //                 </span>
// //             </div>
// let temp1 = document.createElement("div");
// temp1.classList = "message middle";
// let temp2 = document.createElement("span");
// temp2.textContent = data + " Joined the Chat ";
// temp2.classList = "message-middle";
// temp1.appendChild(temp2);
// mess_bd.appendChild(temp1);

// set_scroll_to_bottom(mess_bd);
// });

socket.on("friend-status", (data) => { 
  if (curr_f_id == data.id) {
    header_name.children[1].children[1].textContent = data.current_status;
  }
});

socket.on("typing", (data) => {

  if (curr_f_id == data.u_id) {

    header_name.children[1].children[1].textContent = "typing...";
  }
});

socket.on("not-typing", (data) => {
  if (curr_f_id == data.u_id) {

    header_name.children[1].children[1].textContent = "online";
  }

});
socket.on("setid", (data) => { 
  user_id = data.id;
});

socket.on("rec-message", (data) => {
 
  let temp ; 
  data.direction = "in";
  if (data.user_id == curr_f_id && col_2.style.display == "inline-block") {

    //m_q.matches && col_2.style.display == "block" && m_q.matches==false 
 
    //if recieved message is file 
    if (data.messageType == "file") { 
      temp = make_file_sent_element(data);
    } else {
      temp = make_message_element(data);
    }
   
    mess_bd.appendChild(temp);
    set_scroll_to_bottom(mess_bd);
  }
  else {

    if (message_list[data.user_id] != undefined) {

      message_list[data.user_id].push(data);
    } else {
      message_list[data.user_id] = [data];
    }
    let elem = document.getElementById(data.user_id);
    if( elem && elem.children && elem.children[0]){ 
      elem = elem.children[0].children[1];
      elem.children[0].textContent = message_list[data.user_id].length;
      elem.classList.remove("not-visible");
    }

  }

  if (mess_tone == undefined || mess_tone == "on") {
    ping_audio.currentTime = 0;
    ping_audio.play();
  }

});

function createIncomingCallElem( data) { 
  // check if profile image exists and if start with https or not 
  let profileImgPath =  data.profileImg ? 
    data.profileImg.startsWith("https://") ?  data.profileImg : "/upload/" +  data.profileImg 
    : "./img/profile/"+  d_img_url  ; 
    // let prof_img = data.profileImg ? "/upload/" + data.profileImg : "/img/profile/" + d_img_url    ; 
  let elem_str =`<div class="call-opt-bx">
    <p class="prof-tl"> ${data.name}</p>

    <div class="prof-img-par-bx">
      <span class="prof-img" style="background-image: url('${profileImgPath}');"> </span>
    </div>

    <br />
    <div style="display:flex">
  <button class="call-but" onclick="handleAcceptCall()"> <i class="fas fa-phone-alt"
        style="font-size:18px;padding-right:2px"></i> <span id="call_but_text">Accept</span> </button>

  <button class="call-but decline-but" onclick="handleDeclineCall()">
      <i class="fas fa-phone-slash"></i> 
      
      <span id="call_but_text">Decline</span> </button>

    </div> 

  </div> ` ; 
      
  let temp = document.createElement("div");
   
  temp.classList = "incoming-call-bx";
  
  temp.innerHTML = elem_str;
  return temp ; 
}

function handleIncomingCall( data) {
    
  // let data ={ handleDeclineCall }
  let call_elem  = createIncomingCallElem(data);  
  incoming_call_bx.innerHTML = ""; 
  incoming_call_bx.appendChild(call_elem);
    
}

function handleDeclineCall( ) {
  
  incoming_call_bx.innerHTML =""; 
  let li = getCookie("li");
  let data = {  li } ; 
  socket.emit("call-decline",data);
    
}
function handleAcceptCall( ) {
 
  is_redirecting = true ; 
  window.location =`/video-chat?f_id=${ incoming_call_data.f_id}&type=rec` ; 
}
// setTimeout( ()=>{
//     handleIncomingCall(); 
//     console.log(setTimeout )
// }, 2000)
// function declineCall

// --------- Socket Events ------------------

// socket.on("redirect", (data) => {
//     // location = "./login";
//     alert( "login again")
// });

// socket.on("user-disconnected", (data) => {
//     console.log("new user in client ");

//     let temp1 = document.createElement("div");
//     temp1.classList = "message middle";
//     let temp2 = document.createElement("span");
//     temp2.textContent = data + " leave the Chat ";
//     temp2.classList = "message-middle";
//     temp1.appendChild(temp2);
//     mess_bd.appendChild(temp1);

//     set_scroll_to_bottom(mess_bd);
//     });

socket.on("user-disconnected", (data) => {
 
  let temp1 = document.createElement("div");
  temp1.classList = "message middle";
  let temp2 = document.createElement("span");
  temp2.textContent = data + " leave the Chat ";
  temp2.classList = "message-middle";
  temp1.appendChild(temp2);
  mess_bd.appendChild(temp1);

  set_scroll_to_bottom(mess_bd);
});

socket.on("calling", (data) => {
 
  incoming_call_data = data ; 
  handleIncomingCall(  data  ); 
});
