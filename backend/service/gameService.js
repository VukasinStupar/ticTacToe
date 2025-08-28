const gameRepository = require('../repository/gameRepository');

const GameService = {

  createGame: async ({ userId, typeOfPlay }) => {
    try {
      const game = await gameRepository.createGame({ userId, typeOfPlay });
      return game;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getAllGames: async () => {
    try {
      const games = await gameRepository.getAllGames();
      return games;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateWinner: async (gameId, whoWin) => {
    try {
      const game = await gameRepository.findGameById(gameId);
      if (!game) throw new Error("Game not found");

      const updatedGame = await gameRepository.updateWinner(gameId, whoWin);
      return updatedGame;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getOpenGames: async () => {
    try {
      const games = await gameRepository.getOpenGames();
      return games;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = GameService;