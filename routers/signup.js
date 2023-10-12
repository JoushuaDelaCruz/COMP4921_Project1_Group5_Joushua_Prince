const express = require("express");
const router = express.Router();
const expireTime = 60 * 60 * 1000; //expires after 1 day  (hours * minutes * seconds * millis)

router.get("/", function (req, res) {
  res.render("signup");
});

router.post("/authenticate", function (req, res) {
  console.log(req.body);
  const username = req.body.username;
  res.send(username);
});

module.exports = router;
