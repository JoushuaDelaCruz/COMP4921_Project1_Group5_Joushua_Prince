const database = include("mySQLDatabaseConnection");

const create = async (post) => {
  const query = `
          INSERT INTO contents (user_id, content, parent_id, date_created)
          VALUES (:user_id, :content, :parent_id, :date_created)
      `;
  const params = {
    user_id: post.user_id,
    content: post.content,
    parent_id: post.parent_id,
    date_created: post.date_created,
  };
  try {
    const result = await database.query(query, params);
    return result[0];
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getPostReplies = async (post_id) => {
  const query = `
  WITH RECURSIVE cte_posts AS 
	( SELECT content_id, user_id, content, date_created, parent_id, content_id AS super_parent, 0 AS level
	  FROM contents WHERE content_id = :post_id
      UNION
      SELECT c.content_id, c.user_id, c.content, c.date_created, c.parent_id, cte.super_parent, cte.level + 1
      FROM cte_posts cte
      JOIN contents c ON cte.content_id = c.parent_id
    )
  SELECT 
    cte.content_id,
    cte.user_id,
    username,
    profile_img,
    title,
    date_created,
    content,
    parent_id,
    level
  FROM cte_posts cte
  JOIN users USING (user_id)
  JOIN posts p ON p.content_id = cte.super_parent
  WHERE level > 0;
  `;
  const params = {
    post_id: post_id,
  };
  try {
    const replies = await database.query(query, params);
    return replies[0];
  } catch (err) {
    console.log(err);
    return null;
  }
};

const search = async (keyword) => {
  const query = `
 SELECT content_id, content, MATCH(content) AGAINST (:keyword IN BOOLEAN MODE) as score
FROM contents
WHERE is_removed = 0 
      AND MATCH(content) AGAINST (:keyword IN BOOLEAN MODE) > 0
ORDER BY score DESC;

  `;
  const params = {
    keyword: keyword
  };
  try {
    const result = await database.query(query, params);
    console.log(result[0])
    return result[0];
  } catch (error) {
    console.error("Error while getting contetms:", error);
    return false;
  }
};

const getCommentReplies = async (comment_id) => {
  const query = `
    WITH RECURSIVE cte_comments AS (
      SELECT 
        content_id,
        user_id,
        content,
        parent_id,
        date_created
      FROM contents
      WHERE content_id = :comment_id -- Specify the content_id of the reply
  
      UNION ALL
  
      SELECT
        c.content_id,
        c.user_id,
        c.content,
        c.parent_id,
        c.date_created
      FROM cte_comments cte
      JOIN contents c ON cte.parent_id = c.content_id
    )
    SELECT *
    FROM cte_comments
    WHERE parent_id IS NULL; -- Filter to retrieve the main parent comment
  `;
  const params = {
    comment_id: comment_id,
  };

  try {
    const replies = await database.query(query, params);
    console.log("OUR REPLIES " + replies[0][0].content_id)
    return replies[0][0].content_id;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = {
  create,
  getPostReplies,
  search,
  getCommentReplies
};