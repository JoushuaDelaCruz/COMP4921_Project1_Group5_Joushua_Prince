const express = require("express");
const router = express.Router();
const db_contents = include("database/db_contents");

router.get("/:post_id", async (req, res) => {
  const post_id = req.params.post_id;
  const replies = await db_contents.getPostReplies(post_id);
  res.send(replies);
});

router.post("/create", async (req, res) => {
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
      username: session.username,
      profile_img: session.profile_img,
      content: req.body.data.content,
      parent_id: req.body.data.parent_id,
      date_created: new Date(),
    };
    const post = await db_contents.create(reply);
    if (!post) {
      res.send(null);
      return;
    }
    res.send(reply);
    return;
  });
});


// router.get("/reply/:comment_id", async (req, res) => {
//   console.log("TRYING")
//   const comment_id = req.params.comment_id;

//   try {
//     const parentComments = await db_contents.getcommentReplies(comment_id);

//     if (parentComments) {
//       res.json({
//         parentComments
//       });
//     } else {
//       res.status(404).json({
//         message: "No parent comments found"
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       message: "Internal server error"
//     });
//   }
// });

module.exports = router;