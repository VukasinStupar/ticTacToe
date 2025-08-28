const playGameMultiplayerService = require('../service/playGameMultiplayerService');
const { getIO } = require('../socket');

const makeMoveUser = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { boardIndex } = req.body;
    const userId = req.user.id;

    const gid = gameId;
    const idx = boardIndex;
    
   
  

    const result = await playGameMultiplayerService.makeMove({
      gameId: gid,
      userId,
      boardIndex: idx
    });
    console.log("move..",result);

    const io = getIO();
    io.to(`game_${gid}`).emit('updateGame', {
      gameId: gid,
      board: result.board,
      move: result.move,
      winnerId: result.winnerId,
      nextTurnUserId: result.nextTurnUserId,
      isBoardFull: result.isBoardFull
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
    const gid = gameId;
    

    const state = await playGameMultiplayerService.getGameState(gid);
    console.log("stanje..",state);

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
    const gid = gameId;
    

    const result = await playGameMultiplayerService.resetGame(gid);

    const io = getIO();
    io.to(`game_${gid}`).emit('gameReset', { gameId: gid });

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
    const gid = gameId;
    

    await playGameMultiplayerService.joinGame({ gameId: gid, userId });

    const io = getIO();
    io.to(`game_${gid}`).emit('playerJoined', { 
      gameId: gid, 
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