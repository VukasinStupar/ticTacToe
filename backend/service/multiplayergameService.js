
const multiplayerGameRepository = require('../repository/multiplayergameRepository');
const {
  AuthenticationError,
  ValidationError,
  NotFoundError,
} = require('../utils/errors'); // use the updated import

const createGame = async (user1_id) => {
  if (!user1_id) throw new ValidationError('user1_id is not sent!');

  const game = await multiplayerGameRepository.createMultiplayergame({
    user1_id,
  });

  if (!game) throw new Error('Cannot create game'); // fallback generic error
  return game;
};

const getAllGames = async () => {
  const games = await multiplayerGameRepository.getAllMultiplayergames();
  if (!games || games.length === 0)
    throw new NotFoundError(
      'Games are not found or already have an opponent'
    );

  return games;
};

const getGameById = async (gameId) => {
  if (!gameId) throw new ValidationError('gameId is not sent!');

  const game = await multiplayerGameRepository.findMultiplayergameById(gameId);
  if (!game) throw new NotFoundError('Game not found');

  return game;
};

const setWinner = async (gameId, winner) => {
  if (!gameId || !winner)
    throw new ValidationError('gameId or winner are not sent!');

  const game = await multiplayerGameRepository.updateWinnerMultiplayergame(
    gameId,
    winner
  );
  if (!game) throw new Error('Cannot set winner');

  return game;
};

const joinExistingGame = async (gameId, user2_id) => {
  if (!gameId || !user2_id)
    throw new ValidationError('gameId or user2_id are not sent!');

  const game = await multiplayerGameRepository.joinGame(gameId, user2_id);
  if (!game) throw new Error('Cannot join existing game!');
  return game;
};


const getOpenGames = async () => {
  const games = await multiplayerGameRepository.getOpenMultiplayergame();
  if (!games || games.length === 0)
    throw new NotFoundError(
      'Games are not found or already have an opponent'
    );

  return games;
};


module.exports = {
  createGame,
  getAllGames,
  getGameById,
  setWinner,
  joinExistingGame,
  getOpenGames,
};
