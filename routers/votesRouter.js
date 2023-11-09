const express = require("express");
const router = express.Router();
const db_votes = include("database/db_votes");

router.post("/toggle", async (req, res) => {
  const vote_id = req.body.data.vote_id;
  const vote_orig = req.body.data.vote_orig;
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
    const success = await db_votes.toggle(vote_id, vote_orig);
    if (success === undefined) {
      res.status(403).send(null);
      return;
    }
    res.send(success);
  });
});

router.post("/record", async (req, res) => {
  const content_id = req.body.data.content_id;
  const is_up_vote = req.body.data.is_up_vote;
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
    const insert_id = await db_votes.record(
      content_id,
      session.user,
      is_up_vote
    );
    if (!insert_id) {
      res.status(403).send(null);
      return;
    }
    res.send({ vote_id: insert_id });
  });
});

router.post("/unVote", async (req, res) => {
  const vote_id = req.body.data.vote_id;
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
    const success = await db_votes.unVote(vote_id);
    res.send(success);
  });
});

module.exports = router;
