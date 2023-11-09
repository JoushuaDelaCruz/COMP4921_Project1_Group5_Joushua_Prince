const express = require("express");
const router = express.Router();
const db_users = include("database/db_users");

router.get("/:username", async (req, res) => {
  const username = req.params.username;
  const user = await db_users.getProfile(username);
  if (!user) {
    res.status(404).send();
    return;
  }
  res.send(user);
  return;
});

router.get("/posts/:username", async (req, res) => {
  const username = req.params.username;
  const posts = await db_users.getProfilePosts(username);
  res.send(posts);
});

router.get("/posts/:username/:session", async (req, res) => {
  const username = req.params.username;
  const session = req.params.session;
  req.sessionStore.get(session, async (err, session) => {
    if (err) {
      console.log(err);
      res.status(500).send();
      return;
    }
    if (!session || !session.authenticated) {
      res.status(401).send();
      return;
    }
    const user_id = session.user;
    const posts = await db_users.getProfilePostsAuth(username, user_id);
    res.send(posts);
  });
});

router.get("/isUserProfile/:username/:session", async (req, res) => {
  const username = req.params.username;
  const session = req.params.session;
  req.sessionStore.get(session, async (err, session) => {
    if (err) {
      console.log(err);
      res.status(500).send(false);
      return;
    }
    if (!session || !session.authenticated) {
      res.send(false);
      return;
    }

    if (session.username === username) {
      res.send(true);
      return;
    } else {
      res.send(false);
      return;
    }
  });
});

router.get("/bookmarks/:session", async (req, res) => {
  const session = req.params.session;
  req.sessionStore.get(session, async (err, session) => {
    if (err) {
      console.log(err);
      res.status(500).send();
      return;
    }
    if (!session || !session.authenticated) {
      res.status(401).send();
      return;
    }
    const user_id = session.user;
    const bookmarks = await db_users.getBookmarks(user_id);
    res.send(bookmarks);
    return;
  });
});

module.exports = router;
