const gameRepository = require('../repository/gameRepository');
const { ValidationError, NotFoundError } = require('./errorService');

const VALID_GAME_TYPES = ['SINGLE_PLAYER', 'MULTI_PLAYER'];

const createGame = async ({ userId, datetime, typeOfPlay }) => {
  try {
    if (!userId || !typeOfPlay) {
      throw new ValidationError('userId and typeOfPlay are required');
    }
    if (!VALID_GAME_TYPES.includes(typeOfPlay)) throw new Error('Invalid game type');

    const game = await gameRepository.createGame({ userId, datetime, typeOfPlay });
    return game;
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    throw new Error(`Failed to create game: ${error.message}`);
  }
};

const findGameByLatestId = async () => {
  try {
    const game = await gameRepository.findGameByLatestId();
    if (!game) {
      throw new NotFoundError(`Game not found`);
    }
    return game;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new Error(`Failed to get game: ${error.message}`);
  }
};

const getAllGames = async () => {
  try {
    const games = await gameRepository.findAllGames();
    return games;
  } catch (error) {
    throw new Error(`Failed to retrieve games: ${error.message}`);
  }
};

module.exports = {
  createGame,
  findGameByLatestId,
  getAllGames
};