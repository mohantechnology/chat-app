
const database = require('../config/database'); 
const supertest = require('supertest');
const path = require('path');
const app = require('../config/app'); 
const mongoose = require('mongoose');

const data = {
  name: "John Wick",
  email : "john@gm.com",
  password: "john@gm.com",
  conformPassword: "john@gm.com",

}
const profileData =   {
  messageTone:   Math.random() >0.5 ? 'off' : 'on',
  profileImg: path.resolve(__dirname, `../public/racoon.jpg`) ,
  profMess: "I am busy" + Math.random(),
  accountType:  'public' 
}


const  commonHeaders = {
  'Content-Type' :  'application/json'
};


beforeAll( async ()=>{
  jest.setTimeout(30 * 1000)
database(); 


// describe('GET /home', function() {
//   it(`should Login Account with  email '${data.email}'`,    async function() { 

    const {body ,headers } = await      supertest(app)
    .post('/login')
    .send({ 
      email :  data.email, 
      password:data.password, 
    }).set(commonHeaders)
    .expect('Content-Type', /application\/json/)
    .expect(200) 
    data.accessToken = body.accessToken ; // store accesstoken for future use 
  
  // });
// });


})

afterAll( async ()=>{
 
  // it(`should logout from account`, async  function() {
    const {body } = await   supertest(app)
    .post('/logout')
    .set(commonHeaders)
    .set("x-access-token", data.accessToken)
    .expect('Content-Type', /application\/json/)
    .expect(200) 

    expect( body).toStrictEqual({
      message:  "Logout Successfully" 
    }); 

  //   console.log(  data.accessToken)
  // });



  await mongoose.connection.close();
})


 


describe('GET /home', function() {

  it('should return  bad request', async function() {
    const {body } = await   supertest(app)
    .get('/home')  
    .expect('Content-Type', /application\/json/)
    .expect(400)  
    expect( body).toStrictEqual({
      "message": "Please Login"
    }); 
 
  });
 
   
    it('should return  unauthenticated', async function() {
      const {body } = await   supertest(app)
      .get('/home')  
      .expect('Content-Type', /application\/json/)
      .expect(401) 
      .set("x-access-token", data.accessToken+"23") 
       expect( body).toStrictEqual({
        "message": "Authorization Failed. Please Loging Again",
      }); 
   
    });


  it('should return  Home page', function(done) {
    supertest(app)
      .get('/home')
      .set("x-access-token", data.accessToken)
      .expect('Content-Type', /text\/html/)
      .expect(200, done);
  });

});

 


describe('GET /profile', function() {

  it('should return  Profile data', async function() {
    const {body } = await   supertest(app)
    .get('/profile')  
      .set("x-access-token", data.accessToken)
    .expect('Content-Type', /application\/json/)
    .expect(200)  
    expect( body).toMatchObject( {
      message: 'Profile Details',
      data: { }
    }); 
    expect(Object.keys(body.data)).toEqual(Object.keys(profileData));
  }); 

});


describe('POST /update_profile', function() {  
   
  it('should update  Profile data', async function() {
    const {body } = await   supertest(app)
    .post('/update_profile')   
    .set('content-type', 'application/octet-stream')
    .field( "profMess", profileData.profMess)
    .field( "messageTone", profileData.messageTone)
    .field( "accountType", profileData.accountType) 
    .attach('profileImg', profileData.profileImg)
      .set("x-access-token", data.accessToken)
    .expect('Content-Type', /application\/json/)
    .expect(200)  
    expect( body).toStrictEqual( { 
       message: 'Profile Updated Successfully'  
    }); 
 
  }); 


  it('should return updated  Profile data', async function() {
    const {body } = await   supertest(app)
    .get('/profile')  
      .set("x-access-token", data.accessToken)
    .expect('Content-Type', /application\/json/)
    .expect(200)  
    expect( body.data).toMatchObject( {
      "profMess" : profileData.profMess ,
      "messageTone" : profileData.messageTone ,
      "accountType" : profileData.accountType ,
    }); 
    
  }); 

});



// describe('GET /list_notifi', function() {

//   it('should return  Notification array', async function() {
//     const {body } = await   supertest(app)
//     .get('/list_notifi')  
//       .set("x-access-token", data.accessToken)
//     .expect('Content-Type', /application\/json/)
//     .expect(200)  
//     // expect( body).toStrictEqual({
//     //   "message": "Please Login"
//     // }); 
 
//   }); 

// });

 