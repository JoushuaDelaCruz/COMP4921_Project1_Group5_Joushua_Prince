const express = require("express");
const router = express.Router();
const db_contents = include("database/db_contents");

router.get("/:text", async (req, res) => {
  const text = req.params.text;
  const results = await db_contents.search(text);
  console.log("searching for: " + text);
  res.send([{ id: 1, text: "test" }]);
});

module.exports = router;
