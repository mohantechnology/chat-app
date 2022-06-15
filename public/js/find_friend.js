var side_list_search_icon = document.getElementById("side-list-search-icon");
var side_list_close_icon = document.getElementById("side-list-close-icon");
var input_search_keyword = document.getElementById("input-search-keyword");
var message_body = document.getElementById("message-body");
var loader = document.getElementById("loader");
var is_recieved_reqest = true;
var d_img_url = "../default_img.png"
var d_mess = "Hello, I am using chat app";


if (localStorage.getItem("ln") != "1") {
    location = "./login";
}



function make_element(data) {

    return `   <div class="friend-profile" >
<div class="friend-image">
    <span class="all_img"
        style="background-image: url(./img/profile/${(data.profile_img ? data.profile_img : d_img_url)});">
    </span>
</div>
<span class="profile">
    <p class="user-name"> ${data.name}</p>
    <p class="user-time">${data.pro_mess ? data.pro_mess : d_mess}  </p>
</span>
<div  id="${data.p_id}" class="${data.p_id == 0 ? 'sended-request-but' : 'send-request-but'}"> 
${data.p_id == 0 ? "Sended Request" : "Send Friend Request"}</div>
</div>
`;
}



message_body.addEventListener("click", (e) => {
    if (e.target.className == "send-request-but") {
        let id = e.target.id;
        console.log(id);
        let xhttp = new XMLHttpRequest();


        xhttp.open("POST", "./send_friend_request", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status >= 200 && this.status < 300) {
                let data = JSON.parse(this.response);
                console.log(data);
                if (data.status == "ok") {


                    // console.log(html_str);
                    e.target.innerHTML = "Request Sended";
                    //   console.log(e.target.className); 
                    e.target.className = "sended-request-but";
                } else {
                    console.log("error occured");
                    console.log(data);

                }
                ;
            }
        }
        let param = "p_id=" + id + "&date=" + (new Date().toLocaleDateString()) + "&time=" + (new Date().toLocaleTimeString());
        xhttp.send(param);

    }
})


async function fetch_friend_list(query) {

    if (true || is_recieved_reqest) {
        is_recieved_reqest = false;

        let param = "searchQuery=" + query;
        let url = "./search_friend";
        // url += "?" + param;
        //  "./search_friend" ;       param = "searchQuery=" + query;
        // history.pushState({}, "some", "/find_friend?query="+ query )

        message_body.innerHTML = ""
        loader.style.display = "block";

        try {
            let response = await sendRequest.get(url + "?" + param);
            response = JSON.parse(response);
            let html_str = "";

            console.log(response);
            let friend_list = response.list;
            if (friend_list.length) {
                friend_list.map((item) => {
                    html_str += make_element(item)
                })
            }
            else {
                html_str = `<div class="friend-profile"><span class="profile">
                <p class="user-time">&nbsp;</p>
                <p class="user-name">"No Result Found"</p>
                <p class="user-time">&nbsp;</p> </span></div>`
            }
            history.pushState({ "html": html_str, query }, "", "/find_friend?query=" + query);

            loader.style.display = "none";
            message_body.innerHTML = html_str;

        }
        catch (err) {
            console.error(err);
        }

        // let xhttp = new XMLHttpRequest();
        // xhttp.open("GET", url, true);
        // // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        // xhttp.onreadystatechange = function () {
        //     if (this.readyState == 4  ) {
        //         console.log(this.response);
        //       if( this.status >= 200 && this.status < 300){ 


        //         let data = JSON.parse(this.response);
        //         console.log(data);
        //         loader.style.display="none"; 
        //         is_recieved_reqest= true;
        //         if (data.status == "ok") {

        //             let len = data.list.length ?data.list.length:0; 
        //             let html_str =""; 
        //             for(let i=0 ; i<len; i++){
        //                 html_str+= make_element(data.list[i])

        //             }
        //             if(len==0){
        //                 html_str = `<div class="friend-profile"><span class="profile">
        //                     <p class="user-time">&nbsp;</p>
        //                     <p class="user-name">"No Result Found"</p>
        //                     <p class="user-time">&nbsp;</p> </span></div>`
        //             }

        //             // console.log(html_str);
        //             message_body.innerHTML = html_str; 

        //         } else {
        //             console.log("error occured");
        //             console.log(data);
        //             if(data.message=="Not a valid user"){
        //                 // windows.location("./login"); 
        //                 window.location = "./login"; 
        //             }
        //         }
        //         ;
        //     }
        // }
        // }

        // xhttp.send();
        // message_body.innerHTML = ""
        // loader.style.display = "block";
    }
}

/* event occured  at  history  back/forward button navigation:*/
window.onpopstate = function (e) {
    console.log("e.state.html")
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
}


function display_error(error) {
    console.log(error);
}




input_search_keyword.addEventListener("keyup", (e) => {




    let search_value = input_search_keyword.value.trim();
    if (!search_value) {
        return;
    }

    side_list_close_icon.style.display = "inline-block";
    side_list_search_icon.style.display = "none";

    // console.log(e.keyCode==13)
    if (e.key == "Enter" || e.keyCode == 13) {


        search_value = encodeURIComponent(input_search_keyword.value.trim());
        // param = "searchQuery=" + search_value;

        fetch_friend_list(search_value);

        // input_search_keyword.value=""; 
        side_list_close_icon.style.display = "none";
        side_list_search_icon.style.display = "inline-block";

    }



});

side_list_close_icon.addEventListener("click", () => {
    side_list_close_icon.style.display = "none";
    side_list_search_icon.style.display = "inline-block";

    input_search_keyword.value = "";

});