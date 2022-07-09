/* eslint-disable no-useless-escape */

var validate ={ 

  password: (input)=> {
  
    if (input && typeof input === "string") {
      
      let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,100})");
      if( strongRegex.test(input)) { 
        return {status:"ok" };
             
      }
    }
   
    return   {status:"error" ,message : "Password must greater than or equal to 8 character and must include at least one  uppercase,  lowercase,  digit and   special character.  " };  
  
  }
  ,
  
  email: (input)=> {
  
    if (input && typeof input === "string" && input.length>7 && input.length <100) {
      let strongRegex = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+.[a-zA-Z0-9.-]+$");
      if( strongRegex.test(input)) { 
        return {status:"ok" };
      }
    }
   
    return   {status:"error" ,message : "Please Enter a valid email " };  
  
  },
  
  name: (input)=> {
  
    if (input && typeof input === "string" && input.length>7 && input.length <30) {
      let regex = new RegExp("[^a-zA-Z. ]+");//matching for other than alphabets and space 
      if( regex.test(input)) { 
        return   {status:"error" ,message : "Username can contain only Alphabets ,'.'  and space" };  
      
      }
    }
       
    return {status:"ok" };
          
  }
  
  ,
  
  phoneNo: (input)=> {
  
    if (input && typeof input === "string"  && input.length >8 &&  input.length<14 ) {
      let sRegex = new RegExp("^[+]?[0-9]+$");
              
      if( sRegex.test(input)) { 
        return {status:"ok" };
      }
    }
       
    return   {status:"error" ,message : "Not a valid Phone Number" };  
          
  },
  digit: (input)=> {
  
    if (input && typeof input === "string" ) {
              
      if( isNaN( input) ||   String(parseInt(input  )) !==   input ) { 
        return  {status:"error" ,message : "Please Enter a valid Number for Employee" };
      }
    }
       
    return    {status:"ok" };
          
  }
  ,
  
  splitWithComma: (input)=> {
  
    if (input && typeof input === "string" ) {
              
      let tag_arr = input.split(",");
      let result_str ="";
      let i =0;  
      let t_value; 
      for( ; i<tag_arr.length; i++ ){ 
        t_value =   tag_arr[i].trim();
        if( t_value) { 
          result_str+=  t_value; 
          i++; 
          break; 
        }
               
      }
               
      for( ; i<tag_arr.length; i++ ){ 
        t_value =   tag_arr[i].trim();
        if( t_value) { 
          result_str+=  "," + t_value;
               
        }
           
      }
                      
      return    result_str; 
    }
       
    return   "";
          
  }
  
  ,
  
  repSpecialChar: (input,replace_with ="")=> {
  
    if (input && typeof input === "string" ) {
            
      return    input.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,replace_with);  
    }
   
    return   "";
      
  }
  
  , 
  url :(input)=> {
  
    if (input && typeof input === "string" ) {
      let sRegex = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
    
      if( sRegex.test(input)) { 
        return {status:"ok" };
      }
    }
   
    return   {status:"error" ,message : "Not a valid Link" };  
      
  },
  
  isValiDate :  (day ,month ,year)=> {
          
    let current_date = new Date(`${month}-${day}-${year}`);
    return   current_date  == 'Invalid Date' ? false : current_date;
       
  },
  
};
  
module.exports = validate ; 