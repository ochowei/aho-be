const fs = require('fs');

const express = require('express');

const hello = require('./api/hello');
const login = require('./api/login');
const auth0db = require('./api/auth0db');
const dashboard = require('./api/dashboard');

const router = express.Router();
let commitId = null;

const getCommitId = () => {
  if (commitId) return commitId;

  let data = fs.readFileSync(`${__dirname}/../.git/HEAD`).toString();
  if (data.startsWith('ref: refs/')) {
    const fileName = `${__dirname}/../.git/${data.split(': ')[1]}`.trim();
    data = fs.readFileSync(fileName).toString();
  }
  commitId = data;
  return commitId;
};

const routes = {
  setup: (app) => {
    app.use('/api/hello', hello);
    app.use('/api/login', login);
    app.use('/api/auth0db', auth0db);
    app.use('/api/dashboard', dashboard);

    // provide commit_id api
    router.get('/commit_id', (req, res) => {
      const result = getCommitId();
      return res.send(result);
    });

    router.get('/api/commit_id', (req, res) => {
      const result = getCommitId();
      return res.send(result);
    });

    app.use(router);
  },
};

module.exports = routes;
