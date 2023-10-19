const express = require("express");
const router = express.Router();
const db_post = include("database/db_posts");

router.get("/", async (req, res) => {
  const authenticated = req.session ? req.session.authenticated : false;
  const posts = await db_post.getPosts();
  res.render("home", { posts: posts, authenticated: authenticated });
});

module.exports = router;
