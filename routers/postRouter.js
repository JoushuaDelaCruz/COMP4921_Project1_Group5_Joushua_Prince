const express = require("express");
const router = express.Router();
const db_post = include("database/db_posts");

router.get("/", async (req, res) => {
  const posts = await db_post.getPosts();
  res.send(posts);
});

router.get("/:post_id", async (req, res) => {
  const post_id = req.params.post_id;
  const post = await db_post.getPost(post_id);
  res.send(post);
});

router.post("/create", async (req, res) => {
  const sessionID = req.body.data.sessionID;
  req.sessionStore.get(sessionID, async (err, session) => {
    if (err) {
      console.error("Error while getting session:", err);
      res.send(false);
      return;
    }
    if (!session) {
      res.send(false);
      return;
    }
    if (!session.authenticated) {
      res.send(false);
      return;
    }
    const post = {
      user_id: session.user,
      title: req.body.data.title,
      content: req.body.data.content,
      date_created: new Date(),
      parent_id: null,
    };
    const success = await db_post.create(post);
    res.send(success);
    return;
  });
});

module.exports = router;
