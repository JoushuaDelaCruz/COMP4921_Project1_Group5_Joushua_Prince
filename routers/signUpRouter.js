const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 12;
const db_users = include("database/db_users");
const cloudinary = include("database/modules/cloudinary");

router.get("/", async (req, res) => {
  res.render("signup");
});

router.post("/", async (req, res) => {
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
    console.log("User created successfully");
    res.send(true);
    return;
  } else {
    console.error("Error while creating user");
    res.send(false);
    return;
  }
});

router.get("/isUsernameExist", async (req, res) => {
  const username = req.body.username;
  try {
    const isExist = await db_users.isUsernameExist(username);
    res.send(isExist);
  } catch (error) {
    console.error("Error while checking username:", error);
    res.send(false);
  }
});

router.get("/isEmailExist", async (req, res) => {
  const email = req.body.email;
  try {
    const isExist = await db_users.isEmailExist(email);
    res.send(isExist);
  } catch (error) {
    console.error("Error while checking email:", error);
    res.send(false);
  }
});

module.exports = router;
