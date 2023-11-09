const express = require("express");
const router = express.Router();
const db_favourites = include("database/db_favourites");

router.post("/addFavourite", async (req, res) => {
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
    const user_id = session.user;
    const content_id = req.body.data.content_id;
    const success = await db_favourites.addFavourite(user_id, content_id);
    if (!success) {
      res.status(403).send(false);
      return;
    }
    res.send(success);
  });
});

router.post("/deleteFavourite", async (req, res) => {
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
    const user_id = session.user;
    const content_id = req.body.data.content_id;
    const success = await db_favourites.deleteFavourite(user_id, content_id);
    if (!success) {
      res.status(403).send(false);
      return;
    }
    res.send(success);
  });
});

module.exports = router;
