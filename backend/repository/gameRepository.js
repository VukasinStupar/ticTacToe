const sequelize = require("../config/db");
const { QueryTypes } = require("sequelize");

const createGame = async ({ userId, typeOfPlay }) => {
  const query = `
    INSERT INTO "game" ("userId", "typeOfPlay", "datetime", "createdAt", "updatedAt")
    VALUES (:userId, :typeOfPlay, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING *
  `;
  const [game] = await sequelize.query(query, {
    replacements: { userId, typeOfPlay },
    type: QueryTypes.INSERT
  });
  return game;
};

const getAllGames = async () => {
  const query = `SELECT * FROM "game" ORDER BY "createdAt" DESC`;
  const games = await sequelize.query(query, { type: QueryTypes.SELECT });
  return games;
};

const findGameById = async (gameId) => {
  const query = `SELECT * FROM "game" WHERE id = :gameId`;
  const [game] = await sequelize.query(query, {
    replacements: { gameId },
    type: QueryTypes.SELECT
  });
  return game;
};

const updateWinner = async (gameId, whoWin) => {
  const query = `
    UPDATE "game"
    SET "whoWin" = :whoWin, "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = :gameId
    RETURNING *
  `;
  const [game] = await sequelize.query(query, {
    replacements: { gameId, whoWin },
    type: QueryTypes.UPDATE
  });
  return game;
};

const joinGame = async (gameId, userId) => {
  const query = `
    UPDATE "game"
    SET "opponentId" = :userId, "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = :gameId AND "opponentId" IS NULL
    RETURNING *
  `;
  const [game] = await sequelize.query(query, {
    replacements: { gameId, userId },
    type: QueryTypes.UPDATE
  });
  return game;
};

const getOpenGames = async () => {
  // Umesto kucanja stringa 'MULTI_PLAYER' svuda gde se koristi typeOfPlay bil bi bolje definisati enum na jednom mestu i onda svuda koristiti taj enum
  const query = `
    SELECT *
    FROM "game"
    WHERE "typeOfPlay" = 'MULTI_PLAYER'
      AND "opponentId" IS NULL
    ORDER BY "createdAt" DESC
  `;
  const games = await sequelize.query(query, { type: QueryTypes.SELECT });
  return games;
};

module.exports = {
  createGame,
  getAllGames,
  findGameById,
  updateWinner,
  joinGame,
  getOpenGames
};