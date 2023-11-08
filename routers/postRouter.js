const express = require("express");
const router = express.Router();
const db_post = include("database/db_posts");

router.get("/", async (req, res) => {
  const posts = await db_post.getPosts();
  res.send(posts);
});

router.get("/:session", async (req, res) => {
  req.sessionStore.get(req.params.session, async (err, session) => {
    if (err) {
      console.error("Error while getting session:", err);
      res.send(null);
      return;
    }
    if (!session || !session.authenticated) {
      res.status(401).send(null);
      return;
    }
    const posts = await db_post.getPostsUserAuth(session.user);
    res.send(posts);
  });
});

router.get("/getPost/:post_id", async (req, res) => {
  const post_id = req.params.post_id;
  const post = await db_post.getPost(post_id);
  res.send(post);
});

router.get("/getPost/:post_id/:session", async (req, res) => {
  const post_id = req.params.post_id;
  const sessionID = req.params.session;
  req.sessionStore.get(sessionID, async (err, session) => {
    if (err) {
      console.error("Error while getting session:", err);
      res.status(500).send(null);
      return;
    }
    if (!session || !session.authenticated) {
      res.status(401).send(null);
      return;
    }
    const post = await db_post.getPostUserAuth(post_id, session.user);
    res.send(post);
  });
});

router.post("/create", async (req, res) => {
  const sessionID = req.body.data.sessionID;
  req.sessionStore.get(sessionID, async (err, session) => {
    if (err) {
      console.error("Error while getting session:", err);
      res.status(500).send(false);
      return;
    }
    if (!session) {
      res.status(401).send(false);
      return;
    }
    if (!session.authenticated) {
      res.status(401).send(false);
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

router.post("/removeReply", async (req, res) => {
  const sessionID = req.body.data.sessionID;
  const reply_id = req.body.data.reply_id;
  const post_id = req.body.data.post_id;
  req.sessionStore.get(sessionID, async (err, session) => {
    if (err) {
      console.error("Error while getting session:", err);
      res.status(500).send(false);
      return;
    }
    if (!session) {
      res.status(401).send(false);
      return;
    }
    if (!session.authenticated) {
      res.status(401).send(false);
      return;
    }
    const success = await db_post.removeReply(reply_id, post_id, session.user);
    if (!success) {
      res.status(403).send(false);
      return;
    }
    res.send(true);
    return;
  });
});

module.exports = router;
