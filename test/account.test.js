const supertest = require('supertest');
const mongoose = require('mongoose');
const database = require('../config/database');
const app = require('../config/app');

const data = {
  name: 'John Wick',
  email: 'john@gm.com',
  password: 'john@gm.com',
  conformPassword: 'john@gm.com',

};
const commonHeaders = {
  'Content-Type': 'application/json',
};

beforeAll(async () => {
  database();
});

afterAll(async () => {
  // await mongoose.disconnect();
  await mongoose.connection.close();
});

describe('GET /reg', () => {
  it('should return  Registration page', (done) => {
    supertest(app)
      .get('/reg')
      .expect('Content-Type', /text\/html/)
      .expect(200, done);
  });
});

describe('DELETE /del_account', () => {
  it(`should delete Account of email '${data.email}'`, async () => {
    const { body } = await supertest(app)
      .delete('/del_account')
      .send({ email: data.email })
      .set(commonHeaders)
      .expect('Content-Type', /application\/json/)
      .expect(200);

    expect(body).toStrictEqual({
      message: 'Account Delete Successfully',
    });
  });
});

describe('POST /reg', () => {
  it('should return password not match', async () => {
    const { body } = await supertest(app)
      .post('/reg')
      .send({
        name: data.name,
        email: data.email,
        password: data.password,
        conformPassword: `${data.conformPassword}23`,
      }).set(commonHeaders)
      .expect('Content-Type', /application\/json/)
      .expect(400);

    expect(body).toMatchObject({
      message: 'Password not Matched ',
    });
  });

  it(`should Register Account with  email '${data.email}'`, async () => {
    const { body } = await supertest(app)
      .post('/reg')
      .send({
        name: data.name,
        email: data.email,
        password: data.password,
        conformPassword: data.conformPassword,
      }).set(commonHeaders)
      .expect('Content-Type', /application\/json/)
      .expect(201);

    expect(body).toMatchObject({
      message: 'Account Registered Successfully. Please Check your Email to Activate Account.',
    });
  });

  it('should return Account already exists', async () => {
    const { body } = await supertest(app)
      .post('/reg')
      .send({
        name: data.name,
        email: data.email,
        password: data.password,
        conformPassword: data.conformPassword,
      }).set(commonHeaders)
      .expect('Content-Type', /application\/json/)
      .expect(409);

    expect(body).toMatchObject({
      message: 'An account with given values   already exists.',
    });
  });
});

describe('GET /login', () => {
  it('should return  Login page', (done) => {
    supertest(app)
      .get('/login')
      .expect('Content-Type', /text\/html/)
      .expect(200, done);
  });
});

describe('POST /login', () => {
  it('should return unauthenticated', async () => {
    const { body } = await supertest(app)
      .post('/login')
      .send({
        email: data.email,
        password: `${data.password}23`,
      }).set(commonHeaders)
      .expect('Content-Type', /application\/json/)
      .expect(401);

    expect(body).toMatchObject({
      message: 'Invalid Credentials',
    });
  });

  it(`should Login Account with  email '${data.email}'`, async () => {
    const { body} = await supertest(app)
      .post('/login')
      .send({
        email: data.email,
        password: data.password,
      }).set(commonHeaders)
      .expect('Content-Type', /application\/json/)
      .expect(200);

    expect(body).toMatchObject({
      message: 'verfiy successfully',
    });
    expect(body).toHaveProperty('accessToken');

    data.accessToken = body.accessToken; // store accesstoken for future use
  });
});

describe('GET /active', () => {
  it('should return  Activate Account page', (done) => {
    supertest(app)
      .get('/active')
      .expect('Content-Type', /text\/html/)
      .expect(200, done);
  });
});

describe('POST /resend_activate_link', () => {
  it('should  return Invalid credentials', async () => {
    const { body } = await supertest(app)
      .post('/resend_activate_link')
      .send({
        email: data.email,
        password: `${data.password}23`,
      })
      .set(commonHeaders)
      .expect('Content-Type', /application\/json/)
      .expect(401);

    expect(body).toStrictEqual({
      message: 'Invalid Credentials',
    });
  });

  it(`should send Activate Account mail at'${data.email}'`, async () => {
    const { body } = await supertest(app)
      .post('/resend_activate_link')
      .send({
        email: data.email,
        password: data.password,
      })
      .set(commonHeaders)
      .expect('Content-Type', /application\/json/)
      .expect(200);

    expect(body).toStrictEqual({
      message: 'Link Sent Successfully. Please Check your Email to Activate Account.',
    });
  });
});

describe('GET /forgot', () => {
  it('should return  Forgot Password page', (done) => {
    supertest(app)
      .get('/forgot')
      .expect('Content-Type', /text\/html/)
      .expect(200, done);
  });
});

describe('POST /send_verfi_link', () => {
  it(`should send Reset Password Link  at'${data.email}'`, async () => {
    const { body } = await supertest(app)
      .post('/send_verfi_link')
      .send({
        email: data.email,
      })
      .set(commonHeaders)
      .expect('Content-Type', /application\/json/)
      .expect(200);

    expect(body).toStrictEqual({
      message: 'Reset Password Link seneded Successfully. Please Check your Email.',
    });
  });
});

describe('POST /logout', () => {
  it('should logout from account', async () => {
    const { body } = await supertest(app)
      .post('/logout')
      .set(commonHeaders)
      .set('x-access-token', data.accessToken)
      .expect('Content-Type', /application\/json/)
      .expect(200);

    expect(body).toStrictEqual({
      message: 'Logout Successfully',
    });
  });

  it('should show unauthenticated', async () => {
    const { body } = await supertest(app)
      .post('/logout')

      .set(commonHeaders)
      .expect('Content-Type', /application\/json/)
      .expect(400);

    expect(body).toStrictEqual({
      message: 'Please Login',
    });
  });
});
