const express = require("express");
const router = express.Router();
const { handleResponse } = require("../../services/common/response");

router.get("/v1/", (req, res, next) => {
  res.send({ user_id: "123", nickname: "mock-user", email: "mock@mock.org" });
});

module.exports = router;
