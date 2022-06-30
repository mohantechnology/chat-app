const request = require('supertest');
const app = require('../config/app'); 
const data = {
  email : "john@gm.com",
  password: "john@gm.com",
  conformPassword: "john@gm.com",
  
}


describe('GET /reg', function() {
  it('Get Register Page', function(done) {
    request(app)
      .get('/reg')
      .expect('Content-Type', /text/)
      .expect(200, done);
  });
});

// describe('POST /reg', function() {
//   it('Register Account', function(done) {
//     request(app)
//       .post('/reg')
//       .send({
//         email :  data.email, 
//         password:data.password,
//         conformPassword: data.conformPassword,
//       })
//       .expect('Content-Type', /text/)
//       .expect(200, done);
//   });
// });


describe('GET /login', function() {
    it('Get Login Page', function(done) {
      request(app)
        .get('/login')
        .expect('Content-Type', /text/)
        .expect(200, done);
    });
  });
 
  describe('POST /login', function() {
    it('Authenticate User', function(done) {
      jest.setTimeout(30 * 1000)
      request(app)
        .post('/login')
        .send({
          email :  "john@gm.com", 
          password: "john@gm.com"
        })
  

        // .auth('username', 'password')
        // .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });


  describe('GET /search_friend', function() {
    it('Search friends', function(done) {
      request(app)
        .get('/search_friend')
        // .auth('username', 'password')
        // .set('Accept', 'application/json')
        .expect('Content-Type', /text/)
        .expect(200, done);
    });
  });
