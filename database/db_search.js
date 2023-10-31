const database = include("mySQLDatabaseConnection");


const searchComments = async (keyword) => {
    const query = `
          SELECT text, MATCH(keyword) AGAINST (:keyword IN BOOLEAN MODE) as score,
          text
          FROM comments
          ORDER BY 2 DESC;
          
    `;
    const params = { keyword: keyword };
    try {
      const result = await database.query(query, params);
      return result[0].length > 0;
    } catch (error) {
      console.error("Error while checking username:", error);
      return false;
    }
  };

  module.exports = {
   searchComments
  };