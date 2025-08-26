const PlayGameService = require("../service/playGameService");

const move = async (req, res) => {
  const { gameId } = req.params;   
  const { index, sign } = req.body;

  try {
    const result = await PlayGameService.handlePlayerMove(gameId, index, sign, "user");

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
        board: result.board,
        winner: result.winner
      });
    }

    let finalResult = result;
    if (!result.winner) {
      const aiResult = await PlayGameService.handleComputerMove(gameId);
      finalResult = aiResult;
    }

    res.status(200).json({
      success: true,
      board: finalResult.board,
      winner: finalResult.winner
    });

  } catch (error) {
    console.error("Move error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const status = async (req, res) => {
  const { gameId } = req.params;

  try {
    const gameStatus = await PlayGameService.getGameStatus(gameId);

    res.status(200).json({
      success: true,
      board: gameStatus.board,
      winner: gameStatus.winner
    });
  } catch (error) {
    console.error("Status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve game status",
      error: error.message
    });
  }
};

const reset = async (req, res) => {
  const { gameId } = req.params;

  try {
    const resetResult = await PlayGameService.resetGame(gameId);

    res.status(200).json({
      success: true,
      message: "Game reset successfully",
      board: resetResult.board,
      winner: resetResult.winner
    });
  } catch (error) {
    console.error("Reset error:", error);
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
