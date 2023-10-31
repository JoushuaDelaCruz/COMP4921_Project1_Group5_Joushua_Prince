const database = include("mySQLDatabaseConnection");

const toggle = (vote_id, vote_value) => {
  const query = `
    UPDATE votes
    SET value = :toggle_value
    WHERE vote_id = :vote_id
    `;
  const params = {
    vote_id: vote_id,
    toggle_value: vote_value,
  };
  console.log("toggle");
  try {
    database.query(query, params);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = { upVote, unvote, downVote, toggle };
