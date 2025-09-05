const GameService = require('../service/gameService');

const createGame = async (req, res) => {
    const userId = req.user.id;

    const game = await GameService.createGame({ userId });

    res.status(201).json({ success: true, game });
};

const getAllGames = async (req, res) => {
    const games = await GameService.getAllGames();
    res.status(200).json({ success: true, games });
};

const updateWinner = async (req, res) => {
    const { gameId } = req.params;
    const { whoWin } = req.body;

    const game = await GameService.updateWinner(gameId, whoWin);
    res.status(200).json({ success: true, game });
};

module.exports = {
  createGame,
  getAllGames,
  updateWinner,
};