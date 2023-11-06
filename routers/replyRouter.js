const express = require("express");
const router = express.Router();
const db_contents = include("database/db_contents");

router.get("/:post_id", async (req, res) => {
  const post_id = req.params.post_id;
  const replies = await db_contents.getPostReplies(post_id);
  res.send(replies);
});

router.get("/:post_id/:session_id", async (req, res) => {
  const post_id = req.params.post_id;
  const session_id = req.params.session_id;
  req.sessionStore.get(session_id, async (err, session) => {
    if (err) {
      console.error("Error while getting session:", err);
      res.status(500).send(null);
      return;
    }
    if (!session) {
      res.status(401).send(null);
      return;
    }
    if (!session.authenticated) {
      res.status(401).send(null);
      return;
    }
    const user_id = session.user;
    const replies = await db_contents.getPostRepliesUserAuth(post_id, user_id);
    res.send(replies);
    return;
  });
});

router.post("/create", async (req, res) => {
  const sessionID = req.body.data.sessionID;
  req.sessionStore.get(sessionID, async (err, session) => {
    if (err) {
      console.error("Error while getting session:", err);
      res.status(500).send(null);
      return;
    }
    if (!session) {
      res.status(401).send(null);
      return;
    }
    if (!session.authenticated) {
      res.status(401).send(null);
      return;
    }
    const reply = {
      content_id: null,
      user_id: session.user,
      username: session.username,
      profile_img: session.profile_img,
      content: req.body.data.content,
      parent_id: req.body.data.parent_id,
      num_votes: 0,
      is_owner: 1,
      is_removed: 0,
      date_created: new Date(),
    };
    const post = await db_contents.create(reply);
    if (!post) {
      res.send(null);
      return;
    }
    reply.content_id = post.insertId;
    res.send(reply);
    return;
  });
});

module.exports = router;
