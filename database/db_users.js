const database = include("mySQLDatabaseConnection");

const getUserID = async (username) => {
  const query = `
    SELECT user_id
    FROM users
    WHERE username = :username
  `;
  const params = { username };
  try {
    const result = await database.query(query, params);
    return result[0][0].user_id;
  } catch (error) {
    console.log("Error while getting user id:", error);
    return null;
  }
};

const create = async (user) => {
  const query = `
        INSERT INTO users (username, email, password, profile_img)
        VALUES (:username, :email, :password, :image)
    `;
  const params = {
    username: user.username,
    password: user.password,
    email: user.email,
    image: user.image,
  };
  try {
    await database.query(query, params);
    return true;
  } catch (error) {
    console.error("Error while creating user:", error);
    return false;
  }
};

const getUserById = async (id) => {
  const query = `
    SELECT username, profile_img
    FROM users
    WHERE user_id = :id
  `;
  const params = { id: id };
  try {
    const result = await database.query(query, params);
    return result[0][0];
  } catch (error) {
    console.error("Error while getting user:", error);
    return null;
  }
};

const getUserByEmail = async (email) => {
  const query = `
    SELECT 
      user_id, 
      username,
      password,
      profile_img
    FROM users
    WHERE email = :email
  `;
  const params = { email: email };
  try {
    const result = await database.query(query, params);
    return result[0][0];
  } catch (error) {
    console.error("Error while getting user:", error);
    return null;
  }
};

const isUsernameExist = async (username) => {
  const query = `
        SELECT username
        FROM users
        WHERE username = :username
  `;
  const params = { username: username };
  try {
    const result = await database.query(query, params);
    return result[0].length > 0;
  } catch (error) {
    console.error("Error while checking username:", error);
    return false;
  }
};

const isEmailExist = async (email) => {
  const query = `
        SELECT email
        FROM users
        WHERE email = :email
  `;
  const params = { email: email };
  try {
    const result = await database.query(query, params);
    return result[0].length > 0;
  } catch (error) {
    console.error("Error while checking email:", error);
    return false;
  }
};

const getProfile = async (username) => {
  const query = `
        SELECT username, profile_img
        FROM users
        WHERE username = :username
  `;
  const params = { username: username };
  try {
    const result = await database.query(query, params);
    return result[0][0];
  } catch (error) {
    console.error("Error while getting profile:", error);
    return null;
  }
};

const getProfilePostsAuth = async (username, current_user_id) => {
  const profile_owner_id = await getUserID(username);
  const query = `
  WITH RECURSIVE cte_posts AS 
  (
      SELECT content_id, content, date_created, content_id AS parent
      FROM contents 
      WHERE parent_id IS NULL AND user_id = :profile_owner_id
      UNION
      SELECT c.content_id, c.content, c.date_created, cte.parent
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
      title,
      cte.date_created,
      content,
      COUNT(*) - 1 AS num_comments,
      IFNULL(vc.num_votes, 0) AS num_votes,
      v.value,
      CASE WHEN f.favourite_id IS NOT NULL THEN 1 ELSE 0 END AS is_favourited,
      CASE WHEN v.vote_id IS NOT NULL THEN 1 ELSE 0 END AS is_voted
  FROM cte_posts cte
  LEFT JOIN posts p ON p.content_id = cte.parent
  LEFT JOIN vote_counts vc ON cte.content_id = vc.content_id
  LEFT JOIN votes v ON cte.content_id = v.content_id AND v.user_id = :user_id
  LEFT JOIN favourites f ON cte.content_id = f.content_id AND f.user_id = :user_id
  GROUP BY cte.parent
  ORDER BY date_created DESC; 
  `;
  const params = {
    profile_owner_id,
    user_id: current_user_id,
  };
  try {
    const result = await database.query(query, params);
    return result[0];
  } catch (error) {
    console.error("Error while getting profile posts:", error);
    return null;
  }
};

const getProfilePosts = async (username) => {
  const user_id = await getUserID(username);
  const query = `
  WITH RECURSIVE cte_posts AS 
  (
      SELECT content_id, content, date_created, content_id AS parent
      FROM contents 
      WHERE parent_id IS NULL AND user_id = :user_id
      UNION
      SELECT c.content_id, c.content, c.date_created, cte.parent
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
      title,
      date_created,
      content,
      COUNT(*) - 1 AS num_comments,
      IFNULL(v.num_votes, 0) AS num_votes
  FROM cte_posts cte
  LEFT JOIN posts p ON p.content_id = cte.parent
  LEFT JOIN vote_counts v ON cte.content_id = v.content_id
  GROUP BY cte.parent
  ORDER BY date_created DESC;  
  `;

  const params = { user_id };

  try {
    const result = await database.query(query, params);
    return result[0];
  } catch (error) {
    console.error("Error while getting profile posts:", error);
    return null;
  }
};

module.exports = {
  create,
  isUsernameExist,
  isEmailExist,
  getUserByEmail,
  getUserById,
  getProfile,
  getProfilePosts,
  getProfilePostsAuth,
};
