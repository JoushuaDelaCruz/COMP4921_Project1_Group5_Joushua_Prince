const database = include("mySQLDatabaseConnection");
const db_content = include("database/db_contents");

const create = async (post) => {
  const content_id = await db_content.create(post);
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

const getPosts = async () => {
  const query = `
  SELECT 
	content_id, 
    u.user_id, 
    num_views, 
    username, 
    profile_img, 
    post_id, 
    title, 
    content, 
    date_created, 
    COUNT(vote_id) as num_votes
  FROM contents
  JOIN posts USING (content_id)
  JOIN users AS u USING (user_id)
  LEFT JOIN votes USING (content_id)
  GROUP BY content_id
  `;
  try {
    const result = await database.query(query);
    return result[0];
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = { create, getPosts };
