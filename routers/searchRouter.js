const express = require("express");
const router = express.Router();
const db_contents = include("database/db_contents");

router.get("/:text", async (req, res) => {
  const text = req.params.text;
  const results = await db_contents.search(text);
  console.log(results)
  console.log("searching for: " + text);

  if (results) {
    res.send([{
      id: 1,
      text: results
    }]);
  } else {
    res.status(404).send({
      message: "Not found"
    });
  }
});

module.exports = router;