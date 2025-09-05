const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

const createMultiplayergame = async ({ user1_id }) => {
  const query = `
    INSERT INTO "multiplayergame" ("user1_id", "date_time")
    VALUES (:user1_id, CURRENT_TIMESTAMP)
    RETURNING *
  `;
  const [multiplayergame] = await sequelize.query(query, {
    replacements: { user1_id },
    type: QueryTypes.SELECT,
  });
  return multiplayergame;
};

const getAllMultiplayergames = async () => {
  const query = `SELECT * FROM "multiplayergame" ORDER BY "date_time" DESC`;
  const multiplayergames = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });
  return multiplayergames;
};

const findMultiplayergameById = async (multiplayergame_id) => {
  const query = `SELECT * FROM "multiplayergame" WHERE id = :multiplayergame_id`;
  const [multiplayergame] = await sequelize.query(query, {
    replacements: { multiplayergame_id },
    type: QueryTypes.SELECT,
  });
  return multiplayergame;
};

const updateWinnerMultiplayergame = async (multiplayergame_id, winner) => {
  const query = `
    UPDATE "multiplayergame"
    SET "winner" = :winner
    WHERE id = :multiplayergame_id
    RETURNING *
  `;
  const [multiplayergame] = await sequelize.query(query, {
    replacements: { multiplayergame_id, winner },
    type: QueryTypes.UPDATE,
  });
  return multiplayergame;
};

const joinGame = async (multiplayergame_id, user2_id) => {
  const query = `
    UPDATE "multiplayergame"
    SET "user2_id" = :user2_id
    WHERE id = :multiplayergame_id AND "user2_id" IS NULL
    RETURNING *
  `;
  const [multiplayergame] = await sequelize.query(query, {
    replacements: { multiplayergame_id, user2_id },
    type: QueryTypes.UPDATE,
  });
  return multiplayergame;
};

const getOpenMultiplayergame = async () => {
  const query = `SELECT * FROM "multiplayergame" WHERE "user2_id" IS NULL ORDER BY "date_time" DESC`;
  const multiplayergames = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });
  return multiplayergames;
};


module.exports = {
  createMultiplayergame,
  getAllMultiplayergames,
  findMultiplayergameById,
  updateWinnerMultiplayergame,
  joinGame,
  getOpenMultiplayergame,
};
