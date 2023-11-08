const database = include("mySQLDatabaseConnection");

const addFavourite = async (user_id, content_id) => {
  const query = `
        INSERT INTO favourites (user_id, content_id, date_created)
        VALUES (:user_id, :content_id, :date_created)
    `;
  const params = {
    user_id,
    content_id,
    date_created: new Date(),
  };
  try {
    const result = await database.query(query, params);
    return result[0].affectedRows > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const deleteFavourite = async (user_id, content_id) => {
  const query = `
            DELETE FROM favourites
            WHERE user_id = :user_id
            AND content_id = :content_id
        `;
  const params = {
    user_id,
    content_id,
  };
  try {
    const result = await database.query(query, params);
    return result[0].affectedRows > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = { addFavourite, deleteFavourite };
