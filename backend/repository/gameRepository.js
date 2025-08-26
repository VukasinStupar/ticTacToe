const sequelize = require("../config/db");
const { QueryTypes } = require("sequelize");

async function createGame({ userId, datetime, typeOfPlay }) {
    const now = new Date();
    const query = `
        INSERT INTO "game" ("userId", "datetime", "typeOfPlay", "createdAt", "updatedAt")
        VALUES (:userId, :datetime, :typeOfPlay, NOW(), NOW())
        RETURNING *
    `;
    const [result] = await sequelize.query(query, {
        replacements: { userId,
                        datetime: now,
                        typeOfPlay 
                    },
        type: QueryTypes.INSERT
    });
    return result;
}

async function findGameByLatestId() {
  const query = `
    SELECT *
    FROM "game"
    WHERE id = (SELECT MAX(id) FROM "game")
  `;
  const [game] = await sequelize.query(query, {
    type: QueryTypes.SELECT
  });
  return game;
}

async function findAllGames() {
    const query = `
        SELECT *
        FROM game g
        ORDER BY g."datetime" DESC
    `;
    const games = await sequelize.query(query, {
        type: QueryTypes.SELECT
    });
    return games;
}

module.exports = {
    createGame,
    findGameByLatestId,
    findAllGames,
};