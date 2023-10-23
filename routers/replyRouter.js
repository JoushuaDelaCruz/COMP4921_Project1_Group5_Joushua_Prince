const express = require("express");
const router = express.Router();
const db_replies = include("database/db_replies");
const db_contents = include("database/db_contents");

router.post("/create", async (req, res) => {
  console.log(req.body.data);
  const sessionID = req.body.data.sessionID;
  req.sessionStore.get(sessionID, async (err, session) => {
    if (err) {
      console.error("Error while getting session:", err);
      res.send(null);
      return;
    }
    if (!session) {
      res.send(null);
      return;
    }
    if (!session.authenticated) {
      res.send(null);
      return;
    }
    const reply = {
      user_id: session.user,
      content: req.body.data.content,
      parent_id: req.body.data.parent_id,
    };
    const post = await db_contents.create(reply);
    res.send(post);
    return;
  });
  res.send(null);
});

module.exports = router;
