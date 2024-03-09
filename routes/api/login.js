const express = require("express");
const router = express.Router();
const { handleResponse } = require("../../services/common/response");

router.get("/v1/", (req, res, next) => {
  res.send({ user_id: "123", nickname: "mock-user", email: "mock@mock.org" });
});

router.post("/v1/", (req, res, next) => {
  const { email, password } = req.body;
  console.log("email", email);
  console.log("password", password);
  res.send({ user_id: "123", nickname: "mock-user", email: email });
});

module.exports = router;
