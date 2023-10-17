const express = require("express");
const router = express.Router();
const db_post = include("database/db_posts");

router.get("/", function (req, res) {
  res.render("post");
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
