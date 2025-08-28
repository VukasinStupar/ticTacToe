
const playGameMultiplayerService = require('../service/playGameMultiplayerService');
const { getIO } = require('../socket');

const makeMoveUser = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { boardIndex } = req.body;
    const userId = req.user.id;

    const result = await playGameMultiplayerService.makeMove({
      gameId: Number(gameId),
      userId,
      boardIndex: Number(boardIndex)
    });

    const io = getIO();
    io.to(`game_${gameId}`).emit('updateGame', {
      gameId,
      ...result
    });

    return res.status(200).json({
      success: true,
      message: 'Move made successfully',
      data: result
    });

  } catch (error) {
    console.error("Make move error:", error);
    if (error.message === "Not your turn" || error.message === "Cell already taken") {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getGameState = async (req, res) => {
  try {
    const { gameId } = req.params;

    const state = await playGameMultiplayerService.getGameState(Number(gameId));
    console.log("Game state:", state);

    return res.status(200).json({
      success: true,
      message: 'Game state fetched successfully',
      data: state
    });
  } catch (error) {
    console.error("Get game state error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const resetGame = async (req, res) => {
  try {
    const { gameId } = req.params;

    const result = await playGameMultiplayerService.resetGame(Number(gameId));

    const io = getIO();
    io.to(`game_${gameId}`).emit('gameReset', { gameId, board: result.board });

    return res.status(200).json({
      success: true,
      message: 'Game reset successfully',
      data: result
    });
  } catch (error) {
    console.error("Reset game error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const joinExistingGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.id;

    await playGameMultiplayerService.joinGame({ gameId: Number(gameId), userId });

    const io = getIO();
    io.to(`game_${gameId}`).emit('playerJoined', { 
      gameId: Number(gameId), 
      opponentId: userId,
      opponentJoined: true
    });

    return res.status(200).json({ 
      success: true, 
      message: "Joined game successfully", 
    });
  } catch (error) {
    console.error("Join game error:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  makeMoveUser,
  getGameState,
  resetGame,
  joinExistingGame,
};
