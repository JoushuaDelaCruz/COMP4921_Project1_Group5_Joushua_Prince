const express = require("express");
const router = express.Router();
const db_contents = include("database/db_contents");

router.get("/:text", async (req, res) => {
  const text = req.params.text;

  try {
    const results = await db_contents.search(text);
    res.send(results);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
});

router.get("/getParent/:content_id", async (req, res) => {
  const content_id = req.params.content_id;

  try {
    const parent = await db_contents.getCommentReplies(content_id);
    if (parent) {
      res.send(parent);
    } else {
      res.status(404).send(null);
    }
  } catch (error) {
    console.error("Error while getting parent:", error);
    res.status(500).send(null);
  }
});

module.exports = router;
