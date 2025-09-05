const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

const getMovesByGameId = async (id_multiplayergame) => {
  const query = `
    SELECT *
    FROM "multiplayergamemoves"
    WHERE "id_multiplayergame" = :id_multiplayergame
    ORDER BY "date_time" ASC
  `;
  return await sequelize.query(query, {
    replacements: { id_multiplayergame },
    type: QueryTypes.SELECT,
  });
};

const createMove = async ({
  id_multiplayergame,
  move_index,
  sign,
  who_played,
  date_time,
}) => {
  const query = `
    INSERT INTO "multiplayergamemoves" ("id_multiplayergame", "move_index", "sign", "who_played", "date_time")
    VALUES (:id_multiplayergame, :move_index, :sign, :who_played, :date_time)
    RETURNING *
  `;
  const [multiplayergamemoves] = await sequelize.query(query, {
    replacements: {
      id_multiplayergame,
      move_index,
      sign,
      who_played,
      date_time,
    },
    type: QueryTypes.SELECT,
  });
  return multiplayergamemoves;
};

const getLastMove = async (id_multiplayergame) => {
  try {
    const query = `
      SELECT *
      FROM "multiplayergamemoves"
      WHERE "id_multiplayergame" = :id_multiplayergame
      ORDER BY "date_time" DESC
      LIMIT 1
    `;
    const [lastMove] = await sequelize.query(query, {
      replacements: { id_multiplayergame },
      type: QueryTypes.SELECT,
    });

    return lastMove || null;
  } catch (err) {
    console.error('Error fetching last move:', err);
    throw err;
  }
};

module.exports = {
  getMovesByGameId,
  createMove,
  getLastMove,
};
