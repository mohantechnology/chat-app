

    let first_col_friend_list = document.getElementById("first-col-friend-list");
    let first_col_input_box = document.getElementById("first-col-input-box");
    let first_col_close_icon = document.getElementById("first-col-close-icon");
    let  first_col_search_icon = document.getElementById("first-col-search-icon");
    let  first_col_search_friend_box = document.getElementById("first-col-search-friend-box");
    

    
        
    first_col_close_icon.addEventListener("click", () => {
        first_col_input_box.value = "";
        first_col_search_icon.style.display = "inline-block";
        first_col_close_icon.style.display = "none";

        let children = first_col_friend_list.children
        let len = children.length;
        for (let i = 1; i < len; i++) {

            children[i].style.display = "inline-block";

        }
        children[0].style.display="none";
    })


      first_col_input_box.addEventListener("keyup", ()=>{
           let search_value = first_col_input_box.value.toLocaleLowerCase();
          
             let flag =0; 


            let children = first_col_friend_list.children 
           let len = children.length;
         
            if(search_value==""){
                first_col_search_icon.style.display="inline-block"; 
                first_col_close_icon.style.display="none"; 

            }
            else{
                 first_col_search_icon.style.display="none"; 
           first_col_close_icon.style.display="inline-block";
            }
           
           for(let i =1; i<len; i++){
                   if(children[i].children[1].children[0].textContent.toLocaleLowerCase().search(search_value)!=-1 ){
                       children[i].style.display="inline-block"; 
                       flag=1; 
                   }
                   else if( children[i].children[1].children[1].textContent.toLocaleLowerCase().search(search_value)!=-1)
                   {
                    children[i].style.display="inline-block"; 
                    flag=1; 
                   }
                   else{
                    children[i].style.display="none"; 
                   }
                }
                if(flag){
                     children[0].style.display="none";
                }
                else{
                   children[0].style.display="inline-block";
                }
             
      }); 
  

    