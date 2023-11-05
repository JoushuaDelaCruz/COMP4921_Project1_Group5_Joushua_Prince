const database = include("mySQLDatabaseConnection");
const db_content = include("database/db_contents");

const create = async (post) => {
  const content = await db_content.create(post);
  const content_id = content.insertId;
  const query = `
    INSERT INTO posts (content_id, title)
    VALUES (:content_id, :title)
  `;
  const params = {
    content_id: content_id,
    title: post.title,
  };
  try {
    await database.query(query, params);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getPost = async (post_id) => {
  const query = `
  WITH RECURSIVE cte_posts AS 
  (
      SELECT content_id, user_id, content, date_created, content_id AS parent
      FROM contents 
      WHERE content_id = :post_id
      UNION
      SELECT c.content_id, c.user_id, c.content, c.date_created, cte.parent
      FROM cte_posts cte
      JOIN contents c ON cte.content_id = c.parent_id
  ), vote_counts AS
  (
      SELECT SUM(v.value) AS num_votes, cte.content_id
      FROM cte_posts cte
      LEFT JOIN votes v ON cte.content_id = v.content_id
      GROUP BY cte.content_id
  )
  SELECT 
      cte.content_id,
      username,
      profile_img,
      title,
      date_created,
      content,
      COUNT(*) - 1 AS num_comments,
      IFNULL(v.num_votes, 0) AS num_votes
  FROM cte_posts cte
  JOIN users USING (user_id)
  LEFT JOIN posts p ON p.content_id = cte.parent
  LEFT JOIN vote_counts v ON cte.content_id = v.content_id
  GROUP BY cte.parent
  ORDER BY date_created DESC;  
  `;
  const params = {
    post_id: post_id,
  };
  try {
    const result = await database.query(query, params);
    return result[0];
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getPostUserAuth = async (post_id, user_id) => {
  const query = `
  WITH RECURSIVE cte_posts AS 
  (
      SELECT content_id, user_id, content, date_created, content_id AS parent
      FROM contents 
      WHERE content_id = :post_id
      UNION
      SELECT c.content_id, c.user_id, c.content, c.date_created, cte.parent
      FROM cte_posts cte
      JOIN contents c ON cte.content_id = c.parent_id
  ), vote_counts AS
  (
      SELECT SUM(v.value) AS num_votes, cte.content_id
      FROM cte_posts cte
      LEFT JOIN votes v ON cte.content_id = v.content_id
      GROUP BY cte.content_id
  )
  SELECT 
      cte.content_id,
      username,
      profile_img,
      title,
      date_created,
      content,
      COUNT(*) - 1 AS num_comments,
      IFNULL(vc.num_votes, 0) AS num_votes,
      v.vote_id,
      v.value,
      CASE WHEN cte.user_id = :user_id THEN 1 ELSE 0 END AS is_owner
  FROM cte_posts cte
  JOIN users USING (user_id)
  LEFT JOIN posts p ON p.content_id = cte.parent
  LEFT JOIN vote_counts vc ON cte.content_id = vc.content_id
  LEFT JOIN votes v ON cte.content_id = v.content_id AND v.user_id = :user_id
  GROUP BY cte.parent
  ORDER BY date_created DESC;
  `;
  const params = {
    post_id: post_id,
    user_id: user_id,
  };
  try {
    const result = await database.query(query, params);
    return result[0];
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getPosts = async () => {
  const query = `
  WITH RECURSIVE cte_posts AS 
  (
      SELECT content_id, user_id, content, date_created, content_id AS parent
      FROM contents 
      WHERE parent_id IS NULL
      UNION
      SELECT c.content_id, c.user_id, c.content, c.date_created, cte.parent
      FROM cte_posts cte
      JOIN contents c ON cte.content_id = c.parent_id
  ), vote_counts AS
  (
      SELECT SUM(v.value) AS num_votes, cte.content_id
      FROM cte_posts cte
      LEFT JOIN votes v ON cte.content_id = v.content_id
      GROUP BY cte.content_id
  )
  SELECT 
      cte.content_id,
      username,
      profile_img,
      title,
      date_created,
      content,
      COUNT(*) - 1 AS num_comments,
      IFNULL(v.num_votes, 0) AS num_votes
  FROM cte_posts cte
  JOIN users USING (user_id)
  LEFT JOIN posts p ON p.content_id = cte.parent
  LEFT JOIN vote_counts v ON cte.content_id = v.content_id
  GROUP BY cte.parent
  ORDER BY date_created DESC;  
  `;
  try {
    const result = await database.query(query);
    return result[0];
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getPostsUserAuth = async (user_id) => {
  const query = `
  WITH RECURSIVE cte_posts AS 
  (
      SELECT content_id, user_id, content, date_created, content_id AS parent
      FROM contents 
      WHERE parent_id IS NULL
      UNION
      SELECT c.content_id, c.user_id, c.content, c.date_created, cte.parent
      FROM cte_posts cte
      JOIN contents c ON cte.content_id = c.parent_id
  ), vote_counts AS
  (
      SELECT SUM(v.value) AS num_votes, cte.content_id
      FROM cte_posts cte
      LEFT JOIN votes v ON cte.content_id = v.content_id
      GROUP BY cte.content_id
  )
  SELECT 
      cte.content_id,
      username,
      profile_img,
      title,
      date_created,
      content,
      COUNT(*) - 1 AS num_comments,
      IFNULL(vc.num_votes, 0) AS num_votes,
      v.vote_id,
      v.value,
      CASE WHEN cte.user_id = :user_id THEN 1 ELSE 0 END AS is_owner
  FROM cte_posts cte
  JOIN users USING (user_id)
  LEFT JOIN posts p ON p.content_id = cte.parent
  LEFT JOIN vote_counts vc ON cte.content_id = vc.content_id
  LEFT JOIN votes v ON cte.content_id = v.content_id AND v.user_id = 7
  GROUP BY cte.parent
  ORDER BY date_created DESC;
  `;
  const params = {
    user_id: user_id,
  };

  try {
    const result = await database.query(query, params);
    return result[0];
  } catch (e) {
    console.log(e);
    return null;
  }
};

const isPostOwner = async (reply_id, user_id) => {
  const query = `
  WITH RECURSIVE cte_posts AS 
	( SELECT 
      content_id, 
      parent_id,
      user_id
	  FROM contents WHERE content_id = :reply_id
      UNION
      SELECT c.content_id, c.parent_id, c.user_id
      FROM cte_posts cte
      JOIN contents c ON cte.parent_id = c.content_id
    )
  SELECT content_id AS post_id
  FROM cte_posts cte
  WHERE parent_id IS NULL AND user_id = :user_id;
  `;
  const params = {
    reply_id: reply_id,
    user_id: user_id,
  };

  try {
    const result = await database.query(query, params);
    return result[0][0];
  } catch (e) {
    console.log(e);
    return null;
  }
};

const setContentRemove = async (reply_id) => {
  const query = `
  UPDATE contents
  SET is_removed = 1, content = "[removed]"
  WHERE content_id = :content_id;
  `;
  const params = {
    content_id: reply_id,
  };

  try {
    const result = await database.query(query, params);
    return result[0].affectedRows;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const removeReply = async (reply_id, post_id, user_id) => {
  const post_owner = await isPostOwner(reply_id, user_id);
  if (post_owner.post_id !== parseInt(post_id)) {
    return false;
  }
  const is_removed = await setContentRemove(reply_id);
  return is_removed === 1;
};

module.exports = {
  create,
  getPosts,
  getPost,
  getPostsUserAuth,
  getPostUserAuth,
  removeReply,
};
