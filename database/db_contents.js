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

const edit = async (content_id, new_text, new_date, user_id) => {
  const query = `
    UPDATE contents
    SET content = :new_text, date_created = :new_date
    WHERE content_id = :content_id AND user_id = :user_id
  `;
  const params = {
    new_text: new_text,
    new_date: new_date,
    content_id: content_id,
    user_id: user_id,
  };
  try {
    await database.query(query, params);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const setDeleted = async (post_id, user_id) => {
  const query = `
    UPDATE contents
    SET content = '[deleted]'
    WHERE content_id = :post_id AND user_id = :user_id
  `;
  const params = {
    post_id: post_id,
    user_id: user_id,
  };
  try {
    await database.query(query, params);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const setRemoved = async (content_id) => {
  const query = `
    UPDATE contents
    SET content = '[removed]'
    WHERE content_id = :content_id
  `;
  const params = { content_id: content_id };
  try {
    await database.query(query, params);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getPostRepliesUserAuth = async (post_id, user_id) => {
  const query = `
  WITH RECURSIVE cte_posts AS 
	( SELECT content_id, user_id, content, date_created, parent_id, content_id AS super_parent, 0 AS level
	  FROM contents WHERE content_id = :post_id
      UNION
      SELECT c.content_id, c.user_id, c.content, c.date_created, c.parent_id, cte.super_parent, cte.level + 1
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
    parent_id,
    IFNULL(vc.num_votes, 0) AS num_votes,
    v.vote_id,
    v.value,
    CASE WHEN cte.user_id = :user_id THEN 1 ELSE 0 END AS is_owner,
    level
  FROM cte_posts cte
  JOIN users USING (user_id)
  JOIN posts p ON p.content_id = cte.super_parent
  LEFT JOIN vote_counts vc ON vc.content_id = cte.content_id
  LEFT JOIN votes v ON cte.content_id = v.content_id AND v.user_id = :user_id
  WHERE level > 0;
  `;
  const params = {
    post_id: post_id,
    user_id: user_id,
  };
  try {
    const replies = await database.query(query, params);
    return replies[0];
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
    parent_id,
    IFNULL(vc.num_votes, 0) AS num_votes,
    level
  FROM cte_posts cte
  JOIN users USING (user_id)
  JOIN posts p ON p.content_id = cte.super_parent
  LEFT JOIN vote_counts vc ON vc.content_id = cte.content_id
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
// TODO...
const search = async (text) => {
  return null;
};

module.exports = {
  edit,
  create,
  getPostReplies,
  getPostRepliesUserAuth,
  search,
  setDeleted,
  setRemoved,
};
