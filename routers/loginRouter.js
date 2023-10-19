const express = require("express");
const router = express.Router();
const expireTime = 60 * 60 * 1000; //expires after 1 day  (hours * minutes * seconds * millis)

router.get("/", function (req, res) {
  const authenticated = req.session ? req.session.authenticated : false;
  if (authenticated) {
    res.redirect("/home");
    return;
  }
  res.render("login");
});

router.post("/", function (req, res) {
  console.log(req.body);
  res.send("POST request to the homepage");
});

module.exports = router;
