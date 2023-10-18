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

const isUsernameExist = async (username) => {
  const query = `
        SELECT username
        FROM users
        WHERE username = :username
  `;
  const params = { username: username };
  try {
    const result = await database.query(query, params);
    console.log("result:", result);
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
    console.log("result:", result);
    return result[0].length > 0;
  } catch (error) {
    console.error("Error while checking email:", error);
    return false;
  }
};

module.exports = { create, isUsernameExist, isEmailExist };
