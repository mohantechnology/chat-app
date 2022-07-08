
const database = require('../config/database');
const supertest = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../config/app');
const mongoose = require('mongoose');


 
 
const data = {
  name: "John Wick",
  email: "john@gm.com",
  password: "john@gm.com",
  conformPassword: "john@gm.com",

}

const friendData = {
  name: "Some Wick",
  email: "some@gm.com",
  password: "some@gm.com",
  conformPassword: "some@gm.com",

}

const messageData = {
  "receiver": {
      "uId": "",
      "currentStatus": ""
  },
  "message": "Hello how are you",
  "messageType": "text", 
  "result": true
}
 
const sampleSavedMessage = {
  "_id": "62c754925bd92b038012731d", 
"createdBy": "self",
 "date": 1657230482853,
 "isReaded": false,
 "message": "Hello how are you",
 "messageDate": "2022-07-07T21:48:02.853Z",
 "messageType": "text",
 "recUserId": "cz6ae06243474a2c18138d"
}

var  fileDetail = {
  inputFilePath :  path.resolve(__dirname, `../public/racoon.jpg`), 

} ; 

const commonHeaders = {
  'Content-Type': 'application/json'
};


beforeAll(async () => {
  
  database();


  // login user 
  const { body } = await supertest(app)
    .post('/login')
    .send({
      email: data.email,
      password: data.password,
        data: "yes"
    }).set(commonHeaders)
    .expect('Content-Type', /application\/json/)
    .expect(200)
  data.accessToken = body.accessToken; // store accesstoken  
  data.uId = body.data.uId; // store accesstoken  

 

  // login friend
  const { body :friendLoginBody } = await supertest(app)
  .post('/login')
  .send({
    email: friendData.email,
    password: friendData.password,
    data: "yes"
  }).set(commonHeaders)
  .expect('Content-Type', /application\/json/)
  .expect(200) ; 
  
  friendData.accessToken = friendLoginBody.accessToken; // store accesstoken 
  friendData.uId = friendLoginBody.data.uId;

})

afterAll(async () => {

// logout user 
    await supertest(app)
    .post('/logout')
    .set(commonHeaders)
    .set("x-access-token", data.accessToken)
    .expect('Content-Type', /application\/json/)
    .expect(200)

 

 
  // logout friend 
  await supertest(app)
    .post('/logout')
    .set(commonHeaders)
    .set("x-access-token", friendData.accessToken)
    .expect('Content-Type', /application\/json/)
    .expect(200)

  
  await mongoose.connection.close();
})





 


describe('POST /upload_file', function() {  
   
  it('should return  bad request', async function () {
    const { body } = await supertest(app)
      .post('/upload_file')
      .attach('uploadFile', fileDetail.inputFilePath)
      .expect('Content-Type', /application\/json/)
      .expect(400)
       expect(body).toMatchObject({
      "message": "Please Login"
    });

  });


  it('should Upload given  file', async function() {
    const {body } = await   supertest(app)
    .post('/upload_file')   
    .set('content-type', 'application/octet-stream')
    .attach('uploadFile', fileDetail.inputFilePath)
      .set("x-access-token", data.accessToken)
    .expect('Content-Type', /application\/json/)
    .expect(200)  
    expect( body).toMatchObject( { 
      message: "File Uploaded Successfully",
 
       })
         
            
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("fileName");
    expect(body.data).toHaveProperty("mimeType");
    expect(body.data).toHaveProperty("filePath");


    fileDetail =   { ...fileDetail , ...body.data}  ; 


    }); 
 
 

 

});




describe('GET /list_download_filemessage', function () {

 
  it('should return  bad request', async function () {
    const { body } = await supertest(app)
    .get('/download_file?fileName=' +fileDetail.fileName)
      .expect('Content-Type', /application\/json/)
      .expect(400)
    expect(body).toStrictEqual({
      "message": "Please Login"
    });

  });


  it('should download given file', async function () {
    const downloadFilePath =  path.resolve (  __dirname + "/../temp/download_file" + path.extname(fileDetail.fileName) );
    fileDetail.downloadFilePath = downloadFilePath; 
    const { body, header } = await supertest(app)
      .get('/download_file?fileName=' + fileDetail.fileName)
      .set("x-access-token", data.accessToken)
      .expect(200)

    expect(header).toHaveProperty('content-disposition');
  
     fs.writeFileSync(downloadFilePath, body); 
    expect(fs.statSync(fileDetail.inputFilePath).size).toBe(fs.statSync(downloadFilePath).size);
    fs.unlinkSync(downloadFilePath);
    
  
  });


    it('should return  file not found', async function () {
    const { body } = await supertest(app)
    .get('/download_file?fileName=some_file.jpg' )
      .set("x-access-token", data.accessToken)
      .expect('Content-Type', /application\/json/)
      .expect(404)
    expect(body).toStrictEqual({
      "message": "File Not Exist"
    });

  });


  
  it('should return  not accessible', async function () {
    const { body } = await supertest(app)
    .get('/download_file?fileName=../../../some_file.jpg' )
      .set("x-access-token", data.accessToken)
      .expect('Content-Type', /application\/json/)
      .expect(403)
    expect(body).toStrictEqual({
      "message": "You  do not have access to download this  file"
    });

  });

});

 

describe('POST /save_message', function () {
 
 

  it('should return  bad request', async function () {
    
  // add  detail
  messageData.receiver.currentStatus = "online"  ; 
  messageData.receiver.uId =  friendData.uId  ;

    const { body } = await supertest(app)
      .post('/save_message')
      .expect('Content-Type', /application\/json/)
      .expect(400)
      .send(messageData)
    expect(body).toStrictEqual({
      "message": "Please Login"
    });

  });


  it("should save message as 'Readed'", async function () {
    messageData.receiver.currentStatus = "online"  ; 
    messageData.receiver.uId =  friendData.uId  ;
  
    const { body } = await supertest(app)
      .post('/save_message')
      .set("x-access-token", data.accessToken)
      .send(messageData)
      .expect('Content-Type', /application\/json/)
    .expect(201)
    expect(body).toMatchObject({
      message: "Message Saved  Successfully",
      data: {
        messageType: messageData.messageType,
        createdBy: 'user',
        message: messageData.message,
        recUserId: friendData.uId,
        sendUserId: data.uId,
        isReaded: true,

      }
    });
  
  });



  it("should save message as 'Unreaded'", async function () {

    messageData.receiver.currentStatus = "offline"  ; 
    messageData.receiver.uId =  friendData.uId  ;

    const { body } = await supertest(app)
      .post('/save_message')
      .set("x-access-token", data.accessToken)
      .send(messageData)
      .expect('Content-Type', /application\/json/)
    .expect(201)
    expect(body).toMatchObject({
      message: "Message Saved  Successfully",
      data: {
        messageType: messageData.messageType,
        createdBy: 'user',
        message: messageData.message,
        recUserId: friendData.uId,
        sendUserId: data.uId,
        isReaded: false,

      }
    });

    

  });

  
  it("should save message with file as 'Readed'", async function () {
    messageData.receiver.currentStatus = "online"  ; 
    messageData.receiver.uId =  friendData.uId  ; 
    messageData.fileName= fileDetail.fileName; 
    messageData.mimeType= fileDetail.mimeType; 
    messageData.messageType = "file"; 
    const { body } = await supertest(app)
      .post('/save_message')
      .set("x-access-token", data.accessToken)
      .send(messageData)
      .expect('Content-Type', /application\/json/)
    .expect(201)
    expect(body).toMatchObject({
      message: "Message Saved  Successfully",
      data: {
        messageType: messageData.messageType,
        createdBy: 'user',
        message: messageData.message,
        recUserId: friendData.uId,
        sendUserId: data.uId,
        isReaded: true,
        fileName : fileDetail.fileName,
        mimeType : fileDetail.mimeType ,
      
      }
    });
   
  });


    it("should save message with file as 'Uneaded'", async function () {
      messageData.receiver.currentStatus = "offline"  ; 
      messageData.receiver.uId =  friendData.uId  ; 
      messageData.fileName= fileDetail.fileName; 
      messageData.mimeType= fileDetail.mimeType; 
      messageData.messageType = "file"; 
      const { body } = await supertest(app)
        .post('/save_message')
        .set("x-access-token", data.accessToken)
        .send(messageData)
        .expect('Content-Type', /application\/json/)
      .expect(201)
      expect(body).toMatchObject({
        message: "Message Saved  Successfully",
        data: {
          messageType: messageData.messageType,
          createdBy: 'user',
          message: messageData.message,
          recUserId: friendData.uId,
          sendUserId: data.uId,
          isReaded: false,
          fileName : fileDetail.fileName,
          mimeType : fileDetail.mimeType ,
        
        }
      });
  
 
  });

});




describe('GET /list_message', function () {

 
  it('should return  bad request', async function () {
    const { body } = await supertest(app)
      .get('/list_message?friendUserId=' +  friendData.uId)
      .expect('Content-Type', /application\/json/)
      .expect(400)
    expect(body).toStrictEqual({
      "message": "Please Login"
    });

  });


  it('should return message list', async function () {
    const { body } = await supertest(app)
    .get('/list_message?friendUserId=' +  friendData.uId)
      .set("x-access-token", data.accessToken)
      .expect('Content-Type', /application\/json/)
      .expect(200)

    expect(body).toMatchObject({
      message: "Messages are",
    });
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("readed");
    expect(body.data).toHaveProperty("unreaded");

    body.data.readed.map((data) => {
      if(data.messageType == "text" ){
        expect(Object.keys(data).sort()).toEqual(Object.keys(sampleSavedMessage).sort());
      }
     else{ 
      expect(Object.keys(data).sort()).toEqual([ ...Object.keys(sampleSavedMessage) , "fileName", "mimeType"] .sort());
     }
    })

    body.data.unreaded.map((data) => {
      if(data.messageType == "text" ){
        expect(Object.keys(data).sort()).toEqual(Object.keys(sampleSavedMessage).sort());
      }
     else{ 
      expect(Object.keys(data).sort()).toEqual([ ...Object.keys(sampleSavedMessage) , "fileName", "mimeType"] .sort());
     }
    })

    


  });



});



