

var sendRequest  = {



    file_put: (param, url,file ) => {

        return new Promise((resolve, reject) => {
    
    
            // var formData = new FormData();
            // formData.append("thefile", file);
         
    
            var xhttp = new XMLHttpRequest();
    
    
    
                /*
    
    Access-Control-Allow-Origin:  http://127.0.0.1:3000
    Access-Control-Allow-Methods: POST
    Access-Control-Allow-Headers: Content-Type, Authorization
    
                /*/
    
    
    
    
    
    
            
            xhttp.onreadystatechange = function () {
    
                // console.log( "ready state is 4 response is  " ,this.status )
                    // console.log( "data is ",this.response)

                if (this.readyState === 4  ) {
                    // console.log( this.status); 
                    // console.log( "ready state is 4 response is  " ,this.status )
                    if(this.status >= 200 && this.status<300){ 
                        
                        resolve( this.response)
                        // console.log( "data is ",this.response)
                        // console.log(  this )
                    }
                    else{ 
                        reject( this.response)
                    }
    
                }
                //  console.log( this.response); 
            };
            
          
            xhttp.onprogress = function (event) {
                // console.log( "proses**lkj")
           
           

               
            
              };
            
            //   xhttp.onreadystatechange =( e) =>{
            //          console.log( "proseslkj")
            //     console.log( e.loaded )
            //     console.log( e.total )
            //     console.log( "ready state is 4 response is  " ,this.status )
            //     console.log( "data is ",this.response)
  
            //   }
    


            xhttp.open("PUT", url, true);
            
            // xhttp.setRequestHeader("Access-Control-Allow-Origin" ,"http://127.0.0.1" );
            // xhttp.setRequestHeader("Access-Control-Allow-Methods" ,"POST" );
            // xhttp.setRequestHeader("Access-Control-Allow-Headers" ,"Content-Type, Authorization" );
            // xhttp.setRequestHeader(  'Content-Type ', "application/pdf"  );
            // xhttp.setRequestHeader(  'Access-Control-Allow-Origin', "*"  );

            // xhttp.withCredentials = true; // pass along cookiesdocument.cookie
            xhttp.setRequestHeader('Content-type', file.type);
            
            // xhttp.setRequestHeader('Content-type', 'application/pdf');
            /// aws s3 cp corporateinstructordev/Course/bajcscsaiyxf8v9.png home/bitnami/my-app/src/
            // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(file);
        }
    
    
        )
    }




,






file_post: ( url,file ) => {

    return new Promise((resolve, reject) => {


        // var formData = new FormData();
        // formData.append("thefile", file);
     

        var xhttp = new XMLHttpRequest();



            /*

Access-Control-Allow-Origin:  http://127.0.0.1:3000
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: Content-Type, Authorization

            /*/






        
        xhttp.onreadystatechange = function () {

            // console.log( "ready state is 4 response is  " ,this.status )
                // console.log( "data is ",this.response)

            if (this.readyState ===4  ) {
                // console.log( this.status); 
                // console.log( "ready state is 4 response is  " ,this.status )
                if(this.status >= 200 && this.status<300){ 
                    
                    resolve( this.response)
                    // console.log( "data is ",this.response)
                    // console.log(  this )
                }
                else{ 
                    reject( this.response)
                }

            }
            //  console.log( this.response); 
        };
        
      
        xhttp.onprogress = function (event) {
            // console.log( "proses**lkj")
       
       

           
        
          };
        
        //   xhttp.onreadystatechange =( e) =>{
        //          console.log( "proseslkj")
        //     console.log( e.loaded )
        //     console.log( e.total )
        //     console.log( "ready state is 4 response is  " ,this.status )
        //     console.log( "data is ",this.response)

        //   }



        xhttp.open("POST", url, true);
        
        // xhttp.setRequestHeader("Access-Control-Allow-Origin" ,"http://127.0.0.1" );
        // xhttp.setRequestHeader("Access-Control-Allow-Methods" ,"POST" );
        // xhttp.setRequestHeader("Access-Control-Allow-Headers" ,"Content-Type, Authorization" );
        // xhttp.setRequestHeader(  'Content-Type ', "application/pdf"  );
        // xhttp.setRequestHeader(  'Access-Control-Allow-Origin', "*"  );

        // xhttp.withCredentials = true; // pass along cookiesdocument.cookie
        xhttp.setRequestHeader('Content-type', file.type);
        
        // xhttp.setRequestHeader('Content-type', 'application/pdf');
/// aws s3 cp corporateinstructordev/Course/bajcscsaiyxf8v9.png home/bitnami/my-app/src/
        // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(file);
    }


    )
}


,



file_post_form_data: ( url,file ) => {

    return new Promise((resolve, reject) => {


        var formData = new FormData();
        formData.append("excel", file);
     

        var xhttp = new XMLHttpRequest();


        
        xhttp.onreadystatechange = function () {

            // console.log( "ready state is 4 response is  " ,this.status )
                // console.log( "data is ",this.response)

            if (this.readyState ===4  ) {
                // console.log( this.status); 
                // console.log( "ready state is 4 response is  " ,this.status )
                if(this.status >= 200 && this.status<300){ 
                    
                    resolve( this.response)
                    // console.log( "data is ",this.response)
                    // console.log(  this )
                }
                else{ 
                    reject( this.response)
                }

            }
            //  console.log( this.response); 
        };
        



        xhttp.open("POST", url, true);
        

        // xhttp.setRequestHeader('Content-type', file.type);
        
        // xhttp.setRequestHeader('Content-type', 'application/pdf');
/// aws s3 cp corporateinstructordev/Course/bajcscsaiyxf8v9.png home/bitnami/my-app/src/
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(formData);
    }


    )
}


,







    post: (param, url , content_type) => {

        return new Promise((resolve, reject) => {
            // createCORSRequest( )
            // createCORSRequest()
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState ===4  ) {
                    // console.log( this.status); 
                    if(this.status >= 200 && this.status<300){ 
                        
                        resolve( this.response)
                    }
                    else{ 
                        reject( this.response)
                    }

                }
            };
            xhttp.open("POST", url, true);
            xhttp.setRequestHeader("Content-type", content_type || "application/x-www-form-urlencoded");
        xhttp.setRequestHeader(  'Access-Control-Allow-Origin', "*"  );
           
            // xhttp.setRequestHeader("Content-type", "application/json");

            
            xhttp.withCredentials = true; // pass along cookies
            xhttp.send(param);
        }


        )
    }




,



get_file: ( url) => {

    return new Promise((resolve, reject) => {
        // createCORSRequest( )
        // createCORSRequest()
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState ===4  ) {
                // console.log( this.status); 
                if(this.status >= 200 && this.status<300){ 
                    
                    resolve( this.response)
                }
                else{ 
                    reject( this.response)
                }

            }
        };
        xhttp.open("GET", url, true);

        //content-type:"application/octet-stream"
        xhttp.setRequestHeader("Content-type", "application/octet-stream");
        xhttp.withCredentials = true; // pass along cookies
        // xhttp.setRequestHeader("Content-type", "image/jpeg");
        //Content-Disposition: attachment; filename=quot.pdf;
        // / xhttp.setRequestHeader(  'attachment','attachment' );
        // xhttp.setRequestHeader(  'Access-Control-Allow-Origin', "*"  );
    //    xhttp.setRequestHeader(  'Content-Disposition','attachment' );
        xhttp.send();
    }


    )
}


,
get: ( url) => {

    return new Promise((resolve, reject) => {
        // createCORSRequest( )
        // createCORSRequest()
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState ===4  ) {
                // console.log( this.status); 
                if(this.status >= 200 && this.status<300){ 
                    
                    resolve( this.response)
                }
                else{ 
                    reject( this.response)
                }

            }
        };
        xhttp.open("GET", url, true);
        // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.withCredentials = true; // pass along cookies
        // xhttp.withCredentials
        xhttp.send();
    }


    )
}






}
 

// export  send_xhr;