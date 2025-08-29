const { QueryTypes } = require("sequelize");
const sequelize = require("../config/db");

// Ni jedna funkcija u ovom repozitorijumu nije specificna za multiplayer game, mislim da bi u skladu sa clean code praksama bolje resenje bilo samo dodati getLastMove funkciju u playGameRepository fajl

// Identicna funkcija postoji u playGameRepository
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

// Identicna funkcija postoji u playGameRepository
const createMove = async ({ game_id, user_id, board_index, sign, date_time }) => {
  const query = `
    INSERT INTO "moves" ("game_id", "who_played", "board_index", "sign", "date_time")
    VALUES (:game_id, :user_id, :board_index, :sign, :date_time)
    RETURNING *
  `;
  const [move] = await sequelize.query(query, {
    replacements: { game_id, user_id, board_index, sign, date_time },
    type: QueryTypes.SELECT,
  });
  return move;
};

// Identicna funkcija postoji u playGameRepository
const deleteMovesByGameId = async (gameId) => {
  const query = `DELETE FROM "moves" WHERE "game_id" = :gameId`;
  await sequelize.query(query, {
    replacements: { gameId },
    type: QueryTypes.DELETE,
  });
};

const getLastMove = async (gameId) => {
  const query = `
    SELECT *
    FROM "moves"
    WHERE "game_id" = :gameId
    ORDER BY "date_time" DESC
    LIMIT 1
  `;
  const [last] = await sequelize.query(query, {
    replacements: { gameId },
    type: QueryTypes.SELECT,
  });
  return last || null;
};

module.exports = {
  getMovesByGameId,
  createMove,
  deleteMovesByGameId,
  getLastMove
};