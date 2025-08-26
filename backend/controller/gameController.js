const gameService = require('../service/gameService');
const { ValidationError, NotFoundError } = require('../service/errorService');
const tokenDecode = require('../middleware/tokenDecode');

const createGame = async (req, res) => {
  try {
    const { datetime, typeOfPlay } = req.body;
    const userId = req.user.id; 

    const game = await gameService.createGame({ userId, datetime, typeOfPlay });

    res.status(201).json({
      success: true,
      message: 'Game created successfully',
      game
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Failed to create game', error: error.message });
  }
};

const findGameByLatestId = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await gameService.findGameByLatestId(id);

    res.status(200).json({
      success: true,
      game
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Failed to get game', error: error.message });
  }
};

const getAllGames = async (req, res) => {
  try {
    const games = await gameService.getAllGames();
    res.status(200).json({
      success: true,
      games
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get games', error: error.message });
  }
};

module.exports = {
  createGame,
  findGameByLatestId,
  getAllGames
};
