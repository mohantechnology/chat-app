require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const bcrypt = require('bcrypt');

/* import models */
const userAccount = require('../model/userAccount');
const chatMessage = require('../model/chatMessage');

/* import data */
// const usersData = require('./data/usersData');
// fs.readFileSy
const usersData = JSON.parse(fs.readFileSync(__dirname+ '/data/users.json'),"utf-8");
const messagesData = JSON.parse(fs.readFileSync(__dirname+ '/data/messages.json'),"utf-8");

 
async function createUser(){
  
  // await userAccount.deleteMany(); 
   usersData.map ( async ( currentUser)=>{
  
    let resultAccount = await userAccount.findOne({email: currentUser.email});
    if( !resultAccount){
      currentUser.password = await bcrypt.hash(currentUser.password, parseInt(process.env.SALT_ROUND));
       let result =   await  userAccount.create( currentUser ) ; 
       console.log( "currentUser")
    }else{
      console.warn( `Account with email: '${resultAccount.email}' already exists`);
    }

    // if( currentUser.email){
    //   new_User.push (currentUser )
    // }
  //  fs.writeFileSync(__dirname+"/data/messagesData.json", JSON.stringify( messagesData, null , 2) ) 
  });
  

  // console.log( usersDatas)
  // console.log( "Users Created!") ;

 
}

async function createMessage(){
  messagesData.map ( async ( data)=>{
    if(  data.fileName)
    {
      console.log( "!transferFile/" + data.fileName )
    }
    data.isReaded =   data.isReaded== undefined ? false :data.isReaded ;  
    if(!data.recUserId) {
      console.log( data) ; 
      return ; 
    }
    let result =  await  chatMessage.create( data ) ; 
     
  });

  console.log( "Message Created!") ;
 
}

(async function (){

  console.log( "before database");
  await require('../config/database')();
  console.log( "after database");

  // create users 
  await createUser();

  // // create messages 
  await createMessage();

  // mongoose.connection.close() ;

})();
