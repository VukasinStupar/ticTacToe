const gameRepository = require('../repository/gameRepository');
const {
  AuthenticationError,
  ValidationError,
  NotFoundError,
} = require('../utils/errors'); // import custom errors

const GameService = {
  createGame: async ({ userId }) => {
    if (!userId) throw new ValidationError('userId not found');

    const game = await gameRepository.createGame({ userId });
    if (!game) throw new Error('Cannot create game'); // fallback generic error

    return game;
    
  },

  getAllGames: async () => {
    const games = await gameRepository.getAllGames();
    if (!games || games.length === 0) throw new NotFoundError('Games not found');

    return games;
  },

  updateWinner: async (gameId, whoWin) => {
    if (!gameId || !whoWin) throw new ValidationError('gameId or whoWin not found');

    const game = await gameRepository.findGameById(gameId);
    if (!game) throw new NotFoundError('Game not found');

    const updatedGame = await gameRepository.updateWinner(gameId, whoWin);
    if (!updatedGame) throw new Error('Cannot update game'); // fallback generic error

    return updatedGame;
  },
};

module.exports = GameService;
