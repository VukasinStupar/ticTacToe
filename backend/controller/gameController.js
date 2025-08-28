const GameService = require("../service/gameService");

const createGame = async (req, res) => {
  try {
    const { typeOfPlay } = req.body;
    const userId = req.user.id;

    const game = await GameService.createGame({ userId, typeOfPlay });

    res.status(201).json({ success: true, game });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllGames = async (req, res) => {
  try {
    const games = await GameService.getAllGames();
    res.status(200).json({ success: true, games });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateWinner = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { whoWin } = req.body;

    const game = await GameService.updateWinner(gameId, whoWin);
    res.status(200).json({ success: true, game });
  } catch (err) {
    const statusCode = err.message.includes("not found") ? 404 : 400;
    res.status(statusCode).json({ success: false, message: err.message });
  }
};

const getOpenGames = async (req, res) => {
  try {
    const games = await GameService.getOpenGames();
    res.status(200).json({ success: true, games });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createGame,
  getAllGames,
  updateWinner,
  getOpenGames
};
