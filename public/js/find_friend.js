var side_list_search_icon = document.getElementById("side-list-search-icon");
var side_list_close_icon = document.getElementById("side-list-close-icon");
var input_search_keyword = document.getElementById("input-search-keyword");
var message_body =document.getElementById("message-body");  

function make_element(data) {

   return  `<div class="friend-profile">
    <div class="friend-image">
        <img src=${data.img} alt="profile-image">
     </div>
    <span class="profile">
        <p class="user-name">${data.name}</p>
        <p class="user-time">${data.pro_mess} </p>
           
    </span>
    <div  id="${data.p_id}" class="send-request-but">Send Friend Request</div>

</div>`
}





function send_xhr(param, url) {
    console.log(param); 
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
            let data = JSON.parse(this.response);
            console.log(data);
            if (data.status == "ok") {
                let len = data.list.length ?data.list.length:0; 
                let html_str =""; 
                for(let i=0 ; i<len; i++){
                    html_str+= make_element(data.list[i])

                }
             
                // console.log(html_str);
                message_body.innerHTML = html_str; 

            } else {
                console.log("error occured");
                console.log(data);
                if(data.message=="Not a valid user"){
                    // windows.location("./login"); 
                    window.location = "./login"; 
                }
            }
            ;
        }
    }

    xhttp.send(param);
}
function display_error(error) {
  console.log(error); 
}




input_search_keyword.addEventListener("keyup", (e) => {
    side_list_close_icon.style.display = "inline-block";
    side_list_search_icon.style.display = "none";


    let search_value; 
        // console.log(e.keyCode==13)
        if(  e.key=="Enter" || e.keyCode ==13 ){
                search_value = encodeURIComponent(input_search_keyword.value.trim());
                param = "search_value=" + search_value;
                send_xhr(param, "./find_friend");

            input_search_keyword.value=""; 
            side_list_close_icon.style.display = "none";
            side_list_search_icon.style.display = "inline-block";

        }



});

side_list_close_icon.addEventListener("click", () => {
    side_list_close_icon.style.display = "none";
    side_list_search_icon.style.display = "inline-block";

    input_search_keyword.value = "";

});