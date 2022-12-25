
"use strict" ;

var sendRequest  = {

  file_put: (param, url,file ) => {

    return new Promise((resolve, reject) => {
    
      var xhttp = new XMLHttpRequest();
            
      xhttp.onreadystatechange = function () {
    
        if (this.readyState === 4  ) {
 
          if(this.status >= 200 && this.status<300){ 
                        
            resolve( this.response);
           
          }
          else{ 
            reject( this.response);
          }
    
        }
        
      };

      xhttp.open("PUT", url, true);

      // xhttp.withCredentials = true; // pass along cookiesdocument.cookie
      xhttp.setRequestHeader('Content-type', file.type);
      
      xhttp.send(file);
    }
    
    );
  }

  ,

  file_post: ( url,file ) => {

    return new Promise((resolve, reject) => {

      var xhttp = new XMLHttpRequest();
        
      xhttp.onreadystatechange = function () {

        if (this.readyState ===4  ) {
          
          if(this.status >= 200 && this.status<300){ 
                    
            resolve( this.response);
         
          }
          else{ 
            reject( this.response);
          }

        }
    
      };

      xhttp.open("POST", url, true);

      // xhttp.withCredentials = true; // pass along cookiesdocument.cookie
      xhttp.setRequestHeader('Content-type', file.type);
     
      xhttp.send(file);
    }

    );
  }

  ,

  file_post_form_data: ( url,file ) => {

    return new Promise((resolve, reject) => {

      var formData = new FormData();
      formData.append("excel", file);

      var xhttp = new XMLHttpRequest();
        
      xhttp.onreadystatechange = function () {

        if (this.readyState ===4  ) {
       
          if(this.status >= 200 && this.status<300){ 
                    
            resolve( this.response);
        
          }
          else{ 
            reject( this.response);
          }

        }
       
      };

      xhttp.open("POST", url, true);
 
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send(formData);
    }

    );
  }

  ,

  post: (param, url , content_type, options={}) => {

    return new Promise((resolve, reject) => {
      
      let defaultOpitons ={
        isSetHeader : true , 
        defaultContentType: "application/x-www-form-urlencoded",
        ...options,
      };

      var xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function () {
        if (this.readyState ===4  ) { 
          if(this.status >= 200 && this.status<300){ 
                        
            resolve( this.response);
          }
          else{ 
            reject( this.response);
          }

        }
      };
      xhttp.open("POST", url, true);
      if (defaultOpitons.isSetHeader) {
        xhttp.setRequestHeader("Content-type", content_type || defaultOpitons.defaultContentType );
      }
            
      xhttp.withCredentials = true; // pass along cookies
      xhttp.send(param);
    }

    );
  }

  ,

  get_file: ( url) => {

    return new Promise((resolve, reject) => {
     
      var xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function () {
        if (this.readyState ===4  ) {
          // console.log( this.status); 
          if(this.status >= 200 && this.status<300){ 
                    
            resolve( this.response);
          }
          else{ 
            reject( this.response);
          }

        }
      };
      xhttp.open("GET", url, true);
 
      xhttp.setRequestHeader("Content-type", "application/octet-stream");
      xhttp.withCredentials = true; // pass along cookies
    
      xhttp.send();
    }

    );
  }

  ,
  get: ( url) => {

    return new Promise((resolve, reject) => {
 
      var xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function () {
        if (this.readyState ===4  ) {
          // console.log( this.status); 
          if(this.status >= 200 && this.status<300){ 
                    
            resolve( this.response);
          }
          else{ 
            reject( this.response);
          }

        }
      };
      xhttp.open("GET", url, true);
     
      xhttp.withCredentials = true; // pass along cookies
       
      xhttp.send();
    }

    );
  }

};

// export  send_xhr;