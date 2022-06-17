// require('dotenv').config();
const axios = require('axios'); 

const socketSetup = async () => {
 

    try{ 

        let response = await axios({
          method: 'GET',
          url: process.env.SOCKET_URL , 
         });   
         console.log("Successful Connected to Socket Server"); 
    
      }
      catch (err){ 
        setTimeout(()=>{
            console.log("Retrying to connect with Socket Server.....");
            socketSetup()
            },3000)
      }

 
}
module.exports = socketSetup;