const database = include("mySQLDatabaseConnection");

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

module.exports = {
  create,
  isUsernameExist,
  isEmailExist,
  getUserByEmail,
  getUserById,
};
