const express = require("express");
const router = express.Router();
const db_votes = include("database/db_votes");

router.post("/toggle", async (req, res) => {
  const vote_id = req.body.data.vote_id;
  const vote_value = req.body.data.vote_value;
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
    const success = await db_votes.toggle(vote_id, vote_value);
    res.send(success);
  });
});

module.exports = router;
