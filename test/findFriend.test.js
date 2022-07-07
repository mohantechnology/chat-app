
const database = require('../config/database');
const supertest = require('supertest');
const path = require('path');
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
const searchProfileData = {
  _id: '629dedd420618c0cfc68734c',
  name: 'some@gm.com',
  email: 'some@gm.com',
  uId: 'cz29faf720c6b3e9670988',
  profMess: 'I am last',
  profileImg: 'pf_55bc46e06fac05d8970fc661.png',
  isFriend: false,
  isSendedRequest: false
}


const commonHeaders = {
  'Content-Type': 'application/json'
};


beforeAll(async () => {
  jest.setTimeout(30 * 1000)
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


  // delete  friend account
  await supertest(app)
    .delete('/del_account')
    .send({
      email: friendData.email,
    })
    .set(commonHeaders)
    .expect('Content-Type', /application\/json/)
    .expect(200)


  // register friend
  const { body: friendBody } = await supertest(app)
    .post('/reg')
    .send({
      name: friendData.name,
      email: friendData.email,
      password: friendData.password,
      conformPassword: friendData.conformPassword,
      data: "yes"
    }).set(commonHeaders)
    .expect('Content-Type', /application\/json/)
    .expect(201)
  friendData.uId = friendBody.data.uId;


  // login friend
  const { body :friendLoginBody } = await supertest(app)
  .post('/login')
  .send({
    email: friendData.email,
    password: friendData.password,
  }).set(commonHeaders)
  .expect('Content-Type', /application\/json/)
  .expect(200)
  friendData.accessToken = friendLoginBody.accessToken; // store accesstoken for future use 

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





describe('GET /find_friend', function () {

  it('should return  bad request', async function () {
    const { body } = await supertest(app)
      .get('/find_friend')
      .expect('Content-Type', /application\/json/)
      .expect(400)
    expect(body).toStrictEqual({
      "message": "Please Login"
    });

  });


  it('should return  unauthenticated', async function () {
    const { body } = await supertest(app)
      .get('/find_friend')
      .expect('Content-Type', /application\/json/)
      .expect(401)
      .set("x-access-token", data.accessToken + "23")
    expect(body).toStrictEqual({
      "message": "Authorization Failed. Please Loging Again",
    });

  });


  it('should return  find friend page', function (done) {
    supertest(app)
      .get('/find_friend')
      .set("x-access-token", data.accessToken)
      .expect('Content-Type', /text\/html/)
      .expect(200, done);
  });

});





describe('GET /search_friend', function () {



  it('should return  bad request', async function () {
    const { body } = await supertest(app)
      .get('/search_friend')
      .expect('Content-Type', /application\/json/)
      .expect(400)
    expect(body).toStrictEqual({
      "message": "Please Login"
    });

  });


  it('should return friend list', async function () {
    const { body } = await supertest(app)
      .get('/search_friend?searchQuery=a')
      .set("x-access-token", data.accessToken)
      .expect('Content-Type', /application\/json/)
      .expect(200)
    expect(body).toMatchObject({
      message: 'friend list are',
    });
    expect(body).toHaveProperty("list");
    body.list.map((data) => {
      expect(Object.keys(data).sort()).toEqual(Object.keys(searchProfileData).sort());
    })




  });

});

describe('POST /send_friend_req', function () {
 
  it('should return  bad request', async function () {
    const { body } = await supertest(app)
      .get('/send_friend_req')
      .expect('Content-Type', /application\/json/)
      .expect(400)
    expect(body).toStrictEqual({
      "message": "Please Login"
    });

  });


  it('should send  self uId to friend', async function () {
    const { body } = await supertest(app)
      .post('/send_friend_req')
      .set("x-access-token", data.accessToken)
      .send({ friendUserId: friendData.uId })
      .expect('Content-Type', /application\/json/)
      .expect(200)
    expect(body).toMatchObject({
      message: "Friend Request Sended Successfully"
    });
  });


  it('should return conflict', async function () {
    const { body } = await supertest(app)
      .post('/send_friend_req')
      .set("x-access-token", data.accessToken)
      .send({ friendUserId: friendData.uId })
      .expect('Content-Type', /application\/json/)
      .expect(409)
    expect(body).toMatchObject({
      message: "Already Sended Friend Request"
    });


 

  });

});


describe('POST /accept_friend_req', function () {
 
  it('should return  bad request', async function () {
    const { body } = await supertest(app)
      .get('/accept_friend_req')
      .expect('Content-Type', /application\/json/)
      .expect(400)
    expect(body).toStrictEqual({
      "message": "Please Login"
    });

  });


  it('should accept frined friend', async function () {
    const { body } = await supertest(app)
      .post('/accept_friend_req')
      .set("x-access-token", friendData.accessToken)
      .send({ friendUserId: data.uId })
      .expect('Content-Type', /application\/json/)
      .expect(200)
    expect(body).toMatchObject({
      message: "Accepted Friend Request Successfully",
    });
  });


  it('should show friend request not exist', async function () {
    const { body } = await supertest(app)
      .post('/accept_friend_req')
      .set("x-access-token", friendData.accessToken)
      .send({ friendUserId: data.uId })
      .expect('Content-Type', /application\/json/)
      .expect(404)
    expect(body).toMatchObject({
      message:  "Friend Request Not Exist",
    });
  });

});








