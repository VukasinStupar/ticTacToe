const sequelize = require("../config/db");
const { QueryTypes } = require("sequelize");

async function findGameById(gameId) {
    const query = `
        SELECT board_index, sign
        FROM moves
        WHERE game_id = :gameId
        ORDER BY id
    `;

    const moves = await sequelize.query(query, {
        replacements: { gameId },
        type: QueryTypes.SELECT
    });

    return moves;
}

async function insertMove(gameId, whoPlayed, index, sign) {
    const query = `
        INSERT INTO moves("game_id", "who_played", "board_index", sign, "date_time")
        VALUES (:gameId, :whoPlayed, :boardIndex, :sign, NOW())
        RETURNING *;
    `;
    const [result] = await sequelize.query(query, {
        replacements: { gameId, whoPlayed, boardIndex: index, sign },
        type: QueryTypes.INSERT
    });
    return result;
}

async function resetGame(gameId) {
    const query = `DELETE FROM moves WHERE "game_id" = :gameId;`;
    await sequelize.query(query, {
        replacements: { gameId },
        type: QueryTypes.DELETE
    });
}

module.exports = {
    findGameById,
    insertMove,
    resetGame
};
