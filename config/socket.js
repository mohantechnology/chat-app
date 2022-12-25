// require('dotenv').config();
const axios = require('axios'); 

const socketSetup = async () => {

  try{ 

    await axios({
      method: 'GET',
      url: process.env.SOCKET_URL , 
    });   
    // eslint-disable-next-line no-console
    console.log("Successful Connected to Socket Server"); 
    
  }
  catch (err){ 
    setTimeout(()=>{
      console.error("Retrying to connect with Socket Server.....");
      socketSetup();
    },3000);
  }
 
};
module.exports = socketSetup;