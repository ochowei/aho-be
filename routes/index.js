const fs = require("fs");
const path = require("path");
const basename = path.basename(module.filename);
const express = require("express");
const router = express.Router();
let commitId = null;

const getCommitId = () => {
  if (commitId) return commitId;

  let data = fs.readFileSync(`${__dirname}/../.git/HEAD`).toString();
  if (data.startsWith("ref: refs/")) {
    const fileName = `${__dirname}/../.git/${data.split(": ")[1]}`.trim();
    data = fs.readFileSync(fileName).toString();
  }
  commitId = data;
  return commitId;
};

const routes = {
  setup: (app) => {
    const rootPaths = fs.readdirSync(`${__dirname}/`).filter((file) => {
      return file !== basename;
    });

    rootPaths.forEach((folderPath) => {
      const paths = fs
        .readdirSync(`${__dirname}/${folderPath}`)
        .filter((file) => {
          return file.slice(-3) === ".js" && file !== basename;
        });
      paths.forEach((path) => {
        const filePath = `${__dirname}/${folderPath}/${path}`;
        const router = require(filePath);
        const apiName = path.split(".")[0];
        app.use(`/${folderPath}/${apiName}`, router);
      });
    });

    // provide commit_id api
    // router.get(`/commit_id`, (req, res) => {
    //   let result = getCommitId();
    //   return res.send(result);
    // });

    // router.get(`/api/commit_id`, (req, res) => {
    //   let result = getCommitId();
    //   return res.send(result);
    // });

    app.use(router);
  }
};

module.exports = routes;
