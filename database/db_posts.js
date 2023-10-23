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
	( SELECT content_id, user_id, content, date_created, content_id AS parent
	  FROM contents WHERE parent_id IS NULL
      UNION
      SELECT c.content_id, c.user_id, c.content, c.date_created, cte.parent
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
    COUNT(*) - 1 AS num_comments
  FROM cte_posts cte
  JOIN users USING (user_id)
  JOIN posts p ON p.content_id = cte.parent
  WHERE cte.content_id = :post_id
  GROUP BY parent;
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

const getPosts = async () => {
  const query = `
  WITH RECURSIVE cte_posts AS 
	  (SELECT content_id, user_id, content, date_created, content_id AS parent
	  FROM contents WHERE parent_id IS NULL
      UNION
      SELECT c.content_id, c.user_id, c.content, c.date_created, cte.parent
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
      COUNT(*) - 1 AS num_comments
  FROM cte_posts cte
  JOIN users USING (user_id)
  JOIN posts p ON p.content_id = cte.parent
  GROUP BY parent
  ORDER BY date_created DESC
  `;
  try {
    const result = await database.query(query);
    return result[0];
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = { create, getPosts, getPost };
