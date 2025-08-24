const PlayGameService = require('../service/playGameService');

const move = async (req, res) => {
  const { index, sign } = req.body;

  try {
    const result = await PlayGameService.handlePlayerMove(index, sign);

    if (result.success) {
      if (!await PlayGameService.getGameStatus().winner) {
        await PlayGameService.handleComputerMove();
      }

      res.status(200).json({
        success: true,
        board: result.board,
        winner: result.winner
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const status = async (req, res) => {
  try {
    const gameStatus = await PlayGameService.getGameStatus();

    res.status(200).json({
      success: true,
      board: gameStatus.board,
      winner: gameStatus.winner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve game status",
      error: error.message
    });
  }
};

const reset = async (req, res) => {
  try {
    await PlayGameService.resetGame();

    res.status(200).json({
      success: true,
      message: "Game reset successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reset the game",
      error: error.message
    });
  }
};

module.exports = {
  move,
  status,
  reset
};
