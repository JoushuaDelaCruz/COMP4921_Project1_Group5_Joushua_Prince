const express = require("express");
const router = express.Router();
const db_post = include("database/db_posts");

router.get("/", async (req, res) => {
  const posts = await db_post.getPosts();
  res.send(posts);
});

router.post("/create", async (req, res) => {
  console.log(req.body);
  const post = {
    user_id: 1,
    content: req.body.content,
    parent_id: null,
    title: req.body.title,
  };
  const successful = await db_post.create(post);
  res.send(successful);
});

module.exports = router;
