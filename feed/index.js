require('dotenv').config();
const fs = require('fs');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const database = require('../config/database');

/* import models */
const userAccount = require('../model/userAccount');
const chatMessage = require('../model/chatMessage');
 
/* import data */
const usersData = JSON.parse(fs.readFileSync(__dirname+ '/data/users.json'),"utf-8");
const messagesData = JSON.parse(fs.readFileSync(__dirname+ '/data/messages.json'),"utf-8");
 
async function createUser(){
  
  // await userAccount.deleteMany(); 
  for(let i =0; i<usersData.length; i++ ) {
    let currentUser = usersData[i]; 
    let resultAccount = await userAccount.findOne({email: currentUser.email});
    if( !resultAccount){
      let password = await bcrypt.hash(currentUser.password, parseInt(process.env.SALT_ROUND));
      await  userAccount.create( {...currentUser,password} ) ; 
    
    }else{
      console.warn( `Account with email: '${resultAccount.email}' already exists`);
    }
 
  }
 
  console.info( "Users Created!") ;
 
}

async function createMessage(){
  for(let i =0; i<messagesData.length; i++ ) {
    let data = messagesData[i]; 
    await  chatMessage.create( data ) ; 
     
  }

  console.info( "Message Created!") ;
 
}

async function closeConnection(){
  await  mongoose.connection.close( );
  console.info('disconnected to database sucessfully'); 
  process.exit(0); 
}

(async function (){

  await database(); 

  // create users 
  await createUser();

  // create messages 
  await createMessage();

  console.info( `
You can  Login with following Credentials
1) email:${usersData[0].email}    password:${usersData[0].password} 
2) email:${usersData[1].email}    password:${usersData[1].password}  
`);

  // close connection and exit 
  closeConnection(); 

})();
