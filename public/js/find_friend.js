"use strict" ;
var side_list_search_icon = document.getElementById("side-list-search-icon");
var side_list_close_icon = document.getElementById("side-list-close-icon");
var input_search_keyword = document.getElementById("input-search-keyword");
var message_body = document.getElementById("message-body");
var loader = document.getElementById("loader");
var is_recieved_reqest = true;
var d_img_url = "../default_img.png";
var d_mess = "Hello, I am using chat app";

if (localStorage.getItem("ln") != "1") {
  location = "./login";
}

function make_element(data) {
  let profileImgPath =  data.profileImg ? 
    data.profileImg.startsWith("https://") ?  data.profileImg : "/upload/" +  data.profileImg 
    : "./img/profile/"+  d_img_url  ; 
  return `   <div class="friend-profile" >
<div class="friend-image">
    <span class="all_img"
        style="background-image: url('${profileImgPath}');">
    </span>
</div>
<span class="profile">
    <p class="user-name"> ${data.name}</p>
    <p class="user-time">${data.profMess ? data.profMess : d_mess}  </p>
</span>
<div  id="${data.uId}" class="${data.isFriend  || data.isSendedRequest ?  'sended-request-but' : 'send-request-but'}"> 
${data.isFriend ? "Already Friend" : data.isSendedRequest ?  "Sended Request" : "Send Friend Request"}</div>
</div>
`;
}

message_body.addEventListener("click", async (e) => {
  if (e.target.className == "send-request-but") {
    let id = e.target.id;

    if( !id ) { return ; }
    e.target.className = "sended-request-but";
    try {
      let param = JSON.stringify ({ friendUserId: id }) ; 
   
      let response = await sendRequest.post ( param , "/send_friend_req", "application/json"  );
      response = JSON.parse(response);

      e.target.innerHTML = "Request Sended";
     
    }
    catch (err) {
      console.error(err);
    }

  }
});

async function fetch_friend_list(query) {

  // eslint-disable-next-line no-constant-condition
  if (true  ) {
    is_recieved_reqest = false;

    let param = "searchQuery=" + query;
    let url = "./search_friend";
    // url += "?" + param;
    //  "./search_friend" ;       param = "searchQuery=" + query;
    // history.pushState({}, "some", "/find_friend?query="+ query )

    message_body.innerHTML = "";
    loader.style.display = "block";

    try {
      let response = await sendRequest.get(url + "?" + param);
      response = JSON.parse(response);
      let html_str = "";
 
      let friend_list = response.list;
      if (friend_list.length) {
        friend_list.map((item) => {
          html_str += make_element(item);
        });
      }
      else {
        html_str = `<div class="friend-profile"><span class="profile">
                <p class="user-time">&nbsp;</p>
                <p class="user-name">"No Result Found"</p>
                <p class="user-time">&nbsp;</p> </span></div>`;
      }
      history.pushState({ "html": html_str, query }, "", "/find_friend?query=" + query);

      loader.style.display = "none";
      message_body.innerHTML = html_str;

    }
    catch (err) {
      console.error(err);
    }
    
  }
}

/* event occured  at  history  back/forward button navigation:*/
window.onpopstate = function (e) {
  
  if (e.state) {
    message_body.innerHTML = e.state.html;
    input_search_keyword.value = decodeURIComponent(e.state.query);
  }
};

window.onload = () => {

  /*take query from url and search for friend list */
  let query = getQueryParameterByName("query");
  if (query) {
    fetch_friend_list(query);
    input_search_keyword.value = query;
  }
};

function display_error(error) {
  console.error(error);
}

input_search_keyword.addEventListener("keyup", (e) => {

  let search_value = input_search_keyword.value.trim();
  if (!search_value) {
    return;
  }

  side_list_close_icon.style.display = "inline-block";
  side_list_search_icon.style.display = "none";
 
  if (e.key == "Enter" || e.keyCode == 13) {

    search_value = encodeURIComponent(input_search_keyword.value.trim());
   
    fetch_friend_list(search_value);
 
    side_list_close_icon.style.display = "none";
    side_list_search_icon.style.display = "inline-block";

  }

});

side_list_close_icon.addEventListener("click", () => {
  side_list_close_icon.style.display = "none";
  side_list_search_icon.style.display = "inline-block";

  input_search_keyword.value = "";

});