const express = require("express");
const router = express.Router();
const db_users = include("database/db_users");

router.get("/:username", async (req, res) => {
  const username = req.params.username;
  const user = await db_users.getProfile(username);
  if (!user) {
    res.status(500).send();
    return;
  }
  res.send(user);
  return;
});

router.get("/posts/:username", async (req, res) => {
  const username = req.params.username;
  const posts = await db_users.getProfilePosts(username);
  res.send(posts);
});

module.exports = router;
