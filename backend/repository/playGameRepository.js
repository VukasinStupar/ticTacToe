const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

const getGameById = async (gameId) => {
  const query = `
    SELECT *
    FROM "game"
    WHERE "id" = :gameId
    LIMIT 1
  `;
  const [game] = await sequelize.query(query, {
    replacements: { gameId },
    type: QueryTypes.SELECT,
  });
  return game || null;
  
};

const getMovesByGameId = async (gameId) => {
  const query = `
    SELECT *
    FROM "moves"
    WHERE "game_id" = :gameId
    ORDER BY "date_time" ASC
  `;
  return await sequelize.query(query, {
    replacements: { gameId },
    type: QueryTypes.SELECT,
  });
};

const createMove = async ({
  game_id,
  who_played,
  board_index,
  sign,
  date_time,
}) => {
  const query = `
    INSERT INTO "moves" ("game_id", "who_played", "board_index", "sign", "date_time")
    VALUES (:game_id, :who_played, :board_index, :sign, :date_time)
    RETURNING *
  `;
  const [move] = await sequelize.query(query, {
    replacements: { game_id, who_played, board_index, sign, date_time },
    type: QueryTypes.SELECT,
  });
  return move;
};

const updateGameWinner = async (gameId, winner) => {
  const query = `
    UPDATE "game"
    SET "whoWin" = :winner
    WHERE "id" = :gameId
    RETURNING *
  `;
  const [game] = await sequelize.query(query, {
    replacements: { gameId, winner },
    type: QueryTypes.SELECT,
  });
  return game;
};

const deleteMovesByGameId = async (gameId) => {
  const query = `
    DELETE FROM "moves"
    WHERE "game_id" = :gameId
  `;
  await sequelize.query(query, {
    replacements: { gameId },
    type: QueryTypes.DELETE,
  });
};

module.exports = {
  getGameById,
  getMovesByGameId,
  createMove,
  updateGameWinner,
  deleteMovesByGameId,
};
