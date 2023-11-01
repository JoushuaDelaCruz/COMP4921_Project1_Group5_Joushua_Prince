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
  console.log("Inside search" + keyword)
  const query = `
  SELECT content
  FROM contents
  WHERE content LIKE '%' || :keyword || '%';    

  `;
  const params = {
    keyword: keyword
  };
  try {
    const result = await database.query(query, params);
    return result[0][2]['content'];
  } catch (error) {
    console.error("Error while checking username:", error);
    return false;
  }
};

// const search = async (keyword) => {
//   console.log("Inside search" + keyword)
//   const query = `


//   SELECT 
//   content, 
//   MATCH(content) AGAINST (:keyword IN BOOLEAN MODE) as score 
// FROM 
//   contents 
// WHERE 
//   MATCH(content) AGAINST (:keyword IN BOOLEAN MODE) 
// ORDER BY 
//   score DESC;  

//   `;
//   const params = {
//     keyword: keyword
//   };
//   try {
//     const result = await database.query(query, params);
//     return result[0];
//   } catch (error) {
//     console.error("Error while checking username:", error);
//     return false;
//   }
// };

module.exports = {
  create,
  getPostReplies,
  search
};