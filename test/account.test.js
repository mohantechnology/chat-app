
const database = require('../config/database'); 
const supertest = require('supertest');
const app = require('../config/app'); 
const mongoose = require('mongoose');

const data = {
  name: "John Wick",
  email : "john@gm.com",
  password: "john@gm.com",
  conformPassword: "john@gm.com",
  
}
const  commonHeaders = {
  'Content-Type' :  'application/json'
};


beforeAll( async ()=>{
  jest.setTimeout(30 * 1000)
//   const mongoServer = await MongoMemoryServer.create();
//   console.log( "before all ----->" ,mongoServer.getUri())


// await mongoose.connect(mongoServer.getUri(), { dbName: "testDB" });
database(); 
})

afterAll( async ()=>{
 
 
  // await mongoose.disconnect();
  await mongoose.connection.close();
})



describe('GET /reg', function() {
  it('should return  Registration page', function(done) {
    supertest(app)
      .get('/reg')
      .expect('Content-Type', /text\/html/)
      .expect(200, done);
  });
});


describe('DELETE /del_account', function() {

      it(`should delete Account of email '${data.email}'`, async  function() {
        const {body } = await   supertest(app)
        .delete('/del_account')
        .send({    email :  data.email,  
        })
        .set(commonHeaders)
        .expect('Content-Type', /application\/json/)
        .expect(200)
       
 
        expect( body).toStrictEqual({
          message: "Account Delete Successfully" , 
        }); 
 
      });
})


describe('POST /reg', function() {

  

it(`should return password not match`,    async function() { 
 
  const {body  } = await      supertest(app)
  .post('/reg')
  .send({
    name : data.name,  
    email :  data.email, 
    password:data.password,
    conformPassword: data.conformPassword +"23",
  }).set(commonHeaders)
  .expect('Content-Type', /application\/json/)
  .expect(400)
  
  expect( body).toMatchObject({
    "message": "Password not Matched "
  }); 
  

});


  it(`should Register Account with  email '${data.email}'`,    async function() { 
 
 
      const {body  } = await      supertest(app)
      .post('/reg')
      .send({
        name : data.name, 
        email :  data.email, 
        password:data.password,
        conformPassword: data.conformPassword,
      }).set(commonHeaders)
      .expect('Content-Type', /application\/json/)
      .expect(201)
      
    
      expect( body).toMatchObject({
        message: 'Account Registered Successfully. Please Check your Email to Activate Account.'
      }); 
 
    
  });


  it(`should return Account already exists`,    async function() { 
 
    const {body  } = await      supertest(app)
    .post('/reg')
    .send({
      name : data.name, 
      email :  data.email, 
      password:data.password,
      conformPassword: data.conformPassword,
    }).set(commonHeaders)
    .expect('Content-Type', /application\/json/)
    .expect(409)
    
    expect( body).toMatchObject({
      "message": "An account with given values   already exists."
    }); 
 
  
});

});



describe('GET /login', function() {
  it('should return  Login page', function(done) {
    supertest(app)
      .get('/login')
      .expect('Content-Type', /text\/html/)
      .expect(200, done);
  });
});


describe('POST /login', function() {

 

 

  it(`should return unauthenticated`,    async function() { 
   
    const {body  } = await      supertest(app)
    .post('/login')
    .send({
      email :  data.email, 
      password:data.password +"23", 
    }).set(commonHeaders)
    .expect('Content-Type', /application\/json/)
    .expect(401)
    
    expect( body).toMatchObject({
      "message": "Invalid Credentials"
    }); 
    
  
  });
  
  
    it(`should Login Account with  email '${data.email}'`,    async function() { 

        const {body ,headers } = await      supertest(app)
        .post('/login')
        .send({ 
          email :  data.email, 
          password:data.password, 
        }).set(commonHeaders)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        
        expect( body).toMatchObject({
          "message": "verfiy successfully",
        }); 
        expect( body).toHaveProperty("accessToken")
        
      
    });
  
  
 
  
  });
  
  
