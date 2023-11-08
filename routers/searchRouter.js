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

  //   if (results) {
  //     const resultsWithParentIds = await Promise.all(
  //       results.map(async (result) => {
  //         const parent = await db_contents.getCommentReplies(result.content_id);
  //         if (parent) {
  //           result.parent_id = parent;
  //         }
  //         return result;
  //       })
  //     );
  //     console.log("Parents stuff " + resultsWithParentIds[0].parent_id)
  //     res.send(resultsWithParentIds);
  //   } else {
  //     res.status(404).send({
  //       message: "Not found"
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).send({
  //     message: "Internal server error"
  //   });
  // }
});

module.exports = router;
