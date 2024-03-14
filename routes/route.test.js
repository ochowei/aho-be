// Import the necessary modules and functions
const { expect } = require('chai');

const request = require('supertest');
const express = require('express');
require('express-async-errors');
const cors = require('cors');

const { it } = require('mocha');
const config = require('../config');

const { secToken } = require('../config/authconfig');
// const logger = require('../helpers/common/log')('uncaught');
const middleware = require('../middlewares/common/handler');
const { models } = require('../models');

const consoleLogger = console;

const routes = require('.');

let server = { close: () => {} };

const setupServer = async () => {
  // Run the server
  const app = express();

  app.use(cors(config.cors));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(middleware.traceID);
  routes.setup(app);

  const PORT = 3004;

  // eslint-disable-next-line no-unused-vars
  const errorHandler = (err, req, res, next) => {
    if (res?.locals?.logger) {
      res.locals.logger.error(err);
    } else {
      consoleLogger.error(err);
    }

    const response = {
      msg: 'unhandled error',
      data: {},
    };
    res.send({ response });
  };

  app.use(errorHandler);

  // nunjucks.configure("config/templates", { autoescape: true });

  const afterServer = async () => {
    consoleLogger.log(`[SERVER] server listen on ${PORT}`);
  };
  server = app.listen(PORT, afterServer);
};
const cleanup = async () => {
  await models.User.destroy({ where: {} });
  await models.UserAuth.destroy({ where: {} });
};

describe('Create and Login Route Tests', () => {
  before(async () => {
    await setupServer();
  });

  after(async () => {
    // Close the server
    // app.off('error');
    await server.close();
  });
  afterEach(async () => {
    await cleanup();
  });

  it('test create and login success', async () => {
    // request to localhost:3002/api/auth0db/v1/create
    // with post with header secToken and email, password in body
    const createRes = await request(server)
      .post('/api/auth0db/v1/create')
      .set('secToken', `${secToken}`) // Assuming 'secToken' is your token. Adjust if necessary.
      .send({
        email: 'abc@gmail.com',
        password: '12345678',
      })
      .type('application/json');
    expect(createRes.statusCode).to.equal(200);

    const loginRes = await request(server)
      .put('/api/auth0db/v1/login')
      .set('secToken', `${secToken}`) // Assuming 'secToken' is your token. Adjust if necessary.
      .send({
        email: 'abc@gmail.com',
        password: '12345678',
      })
      .type('application/json');

    expect(loginRes.statusCode).to.equal(200);
  });

  it('test create and password failed', async () => {
    const createRes = await request(server)
      .post('/api/auth0db/v1/create')
      .set('secToken', `${secToken}`) // Assuming 'secToken' is your token. Adjust if necessary.
      .send({
        email: 'abc@gmail.com',
        password: '12345678',
      })
      .type('application/json');
    expect(createRes.statusCode).to.equal(200);
    const loginRes2 = await request(server)
      .put('/api/auth0db/v1/login')
      .set('secToken', `${secToken}`) // Assuming 'secToken' is your token. Adjust if necessary.
      .send({
        email: 'abc@gmail.com',
        password: '12345679',
      })
      .type('application/json');
    expect(loginRes2.statusCode).to.equal(401);
  });

  it('test invalid email', async () => {
    const createRes = await request(server)
      .post('/api/auth0db/v1/create')
      .set('secToken', `${secToken}`) // Assuming 'secToken' is your token. Adjust if necessary.
      .send({
        email: 'abc@gmail.com',
        password: '12345678',
      })
      .type('application/json');
    expect(createRes.statusCode).to.equal(200);
    const loginRes = await request(server)
      .put('/api/auth0db/v1/login')
      .set('secToken', `${secToken}`) // Assuming 'secToken' is your token. Adjust if necessary.
      .send({
        email: 'abcgmail.com',
        password: '12345679',
      })
      .type('application/json');
    expect(loginRes.statusCode).to.equal(400);
  });

  it('test create twice', async () => {
    const createRes = await request(server)
      .post('/api/auth0db/v1/create')
      .set('secToken', secToken) // Assuming 'secToken' is your token. Adjust if necessary.
      .send({
        email: 'abc@gmail.com',
        password: '12345678',
      })
      .type('application/json');
    expect(createRes.statusCode).to.equal(200);
    const createRes2 = await request(server)
      .post('/api/auth0db/v1/create')
      .set('secToken', `${secToken}`) // Assuming 'secToken' is your token. Adjust if necessary.
      .send({
        email: 'abc@gmail.com',
        password: '12345678',
      })
      .type('application/json');
    // print the response
    expect(createRes2.statusCode).to.equal(409);
  });

  it('test create and verify email', async () => {
    const createRes = await request(server)
      .post('/api/auth0db/v1/create')
      .set('secToken', secToken) // Assuming 'secToken' is your token. Adjust if necessary.
      .send({
        email: 'abc@gmail.com',
        password: '12345678',
      })
      .type('application/json');
    expect(createRes.statusCode).to.equal(200);

    const createRes2 = await request(server)
      .put('/api/auth0db/v1/verify')
      .set('secToken', secToken) // Assuming 'secToken' is your token. Adjust if necessary.
      .send({
        email: 'abc@gmail.com',
      })
      .type('application/json');
    expect(createRes2.statusCode).to.equal(200);
  });

  it('test create and change password with the same', async () => {
    const createRes = await request(server)
      .post('/api/auth0db/v1/create')
      .set('secToken', secToken) // Assuming 'secToken' is your token. Adjust if necessary.
      .send({
        email: 'abc@gmail.com',
        password: '12345678',
      })
      .type('application/json');
    expect(createRes.statusCode).to.equal(200);

    const changeRes = await request(server)
      .put('/api/auth0db/v1/changePassword')
      .set('secToken', secToken).send({
        email: 'abc@gmail.com',
        password: '12345678',
      })
      .type('application/json');
    expect(changeRes.statusCode).to.equal(400);
  });

  it('test create and change password with diff', async () => {
    const createRes = await request(server)
      .post('/api/auth0db/v1/create')
      .set('secToken', secToken) // Assuming 'secToken' is your token. Adjust if necessary.
      .send({
        email: 'abc@gmail.com',
        password: '12345678',
      })
      .type('application/json');
    expect(createRes.statusCode).to.equal(200);

    const changeRes = await request(server)
      .put('/api/auth0db/v1/changePassword')
      .set('secToken', secToken).send({
        email: 'abc@gmail.com',
        password: '12345679',
      })
      .type('application/json');
    expect(changeRes.statusCode).to.equal(200);
  });

  it('test change password with not found', async () => {
    const changeRes = await request(server)
      .put('/api/auth0db/v1/changePassword')
      .set('secToken', secToken).send({
        email: 'abc@gmail.com',
        password: '12345679',
      })
      .type('application/json');
    expect(changeRes.statusCode).to.equal(404);
  });

  it('test login by email', async () => {
    const createRes = await request(server)
      .post('/api/auth0db/v1/create')
      .set('secToken', secToken) // Assuming 'secToken' is your token. Adjust if necessary.
      .send({
        email: 'abc@gmail.com',
        password: '12345678',
      })
      .type('application/json');
    expect(createRes.statusCode).to.equal(200);

    const loginRes = await request(server)
      .put('/api/auth0db/v1/loginByEmail')
      .set('secToken', secToken).send({
        email: 'abc@gmail.com',
      })
      .type('application/json');
    expect(loginRes.statusCode).to.equal(200);
  });
  it('test login by wrong email', async () => {
    const loginRes = await request(server)
      .put('/api/auth0db/v1/loginByEmail')
      .set('secToken', secToken).send({
        email: 'abc@gmail.com',
      })
      .type('application/json');
    expect(loginRes.statusCode).to.equal(404);
  });
});
