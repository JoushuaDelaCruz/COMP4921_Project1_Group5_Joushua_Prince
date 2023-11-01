const database = include("mySQLDatabaseConnection");
const UP_VOTE = 1;
const DOWN_VOTE = -1;

const toggle = async (vote_id, vote_orig) => {
  const query = `
    UPDATE votes
    SET value = :toggle_value
    WHERE vote_id = :vote_id
    `;
  const toggled_value = vote_orig === UP_VOTE ? DOWN_VOTE : UP_VOTE;
  const params = {
    vote_id: vote_id,
    toggle_value: toggled_value,
  };
  try {
    await database.query(query, params);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const record = async (content_id, user_id, is_up_vote) => {
  const query = `
    INSERT INTO votes (content_id, user_id, value)
    VALUES (:content_id, :user_id, :value);
  `;
  const params = {
    content_id: content_id,
    user_id: user_id,
    value: is_up_vote ? UP_VOTE : DOWN_VOTE,
  };
  try {
    const result = await database.query(query, params);
    return result[0].insertId;
  } catch (e) {
    console.error(e);
    return false;
  }
};

module.exports = { toggle, record };
