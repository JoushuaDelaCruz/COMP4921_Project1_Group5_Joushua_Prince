const express = require("express");
const router = express.Router();
const db_contents = include("database/db_contents");

router.get("/:text", async (req, res) => {
  const text = req.params.text;
  const results = await db_contents.search(text);

  if (results) {
    const response = results.map(result => ({
      comment_id: result.comment_id,
      content: result.content
    }));

    res.send(response);
  } else {
    res.status(404).send({
      message: "Not found"
    });
  }
});

module.exports = router;
