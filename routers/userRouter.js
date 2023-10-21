const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 12;
const db_users = include("database/db_users");
const cloudinary = include("database/modules/cloudinary");
const expireTime = 60 * 60 * 1000; //expires after 1 hr (hours * minutes * seconds * millis)

router.post("/create", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const image = await cloudinary.getRandomImage();
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const success = await db_users.create({
    username: username,
    email: email,
    password: hashedPassword,
    image: image,
  });
  if (success) {
    res.send(true);
    return;
  } else {
    res.send(false);
    return;
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.data.email;
  const password = req.body.data.password;
  const user = await db_users.getUser(email);
  if (!user) {
    res.send(null);
    return;
  }
  if (bcrypt.compareSync(password, user.password)) {
    req.session.authenticated = true;
    req.session.cookie.maxAge = expireTime;
    res.send(req.sessionID);
    return;
  }
  res.send(null);
  return;
});

router.post("/isUsernameExist", async (req, res) => {
  const username = req.body.data;
  if (!username) {
    res.send(false);
    return;
  }
  try {
    const isExist = await db_users.isUsernameExist(username);
    res.send(isExist);
  } catch (error) {
    console.error("Error while checking username:", error);
    res.send(false);
  }
});

router.post("/isEmailExist", async (req, res) => {
  const email = req.body.data;
  if (!email) {
    res.send(false);
    return;
  }
  try {
    const isExist = await db_users.isEmailExist(email);
    res.send(isExist);
  } catch (error) {
    console.error("Error while checking email:", error);
    res.send(false);
  }
});

module.exports = router;
