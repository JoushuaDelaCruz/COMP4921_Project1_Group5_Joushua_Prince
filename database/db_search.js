const database = include("mySQLDatabaseConnection");


const searchComments = async (keyword) => {
    const query = `
    SELECT 
  text, 
  MATCH(text) AGAINST (: keyword IN BOOLEAN MODE) as score 
FROM 
  comments 
WHERE 
  MATCH(text) AGAINST (: keyword IN BOOLEAN MODE) 
ORDER BY 
  score DESC;



//     `;
//     const params = { keyword: keyword };
//     try {
//       const result = await database.query(query, params);
//       return result[0].length > 0;
//     } catch (error) {
//       console.error("Error while checking username:", error);
//       return false;
//     }
//   };


const searchComments = async (keyword) => {
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
        return result[0].length > 0;
    } catch (error) {
        console.error("Error while checking username:", error);
        return false;
    }
};

module.exports = {
    searchComments
};