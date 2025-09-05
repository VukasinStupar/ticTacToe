const playGameService = require('../service/playGameService');
const { io } = require('../server');

const makeMoveUser = async (req, res) => {
    const { gameId } = req.params;
    const { position } = req.body;
    const userId = req.user.id;

    const result = await playGameService.makeMoveUser(
      gameId,
      userId,
      position,
      io,
      
    );

    res.status(200).json({
      success: true,
      message: 'Move made successfully',
      data: result,
    });
};

const getGameState = async (req, res) => {
    const { gameId } = req.params;

    const state = await playGameService.getGameState(gameId);

    res.status(200).json({
      success: true,
      message: 'Game state fetched successfully',
      data: state,
    });

};

const resetGame = async (req, res) => {

    const { gameId } = req.params;
    const userId = req.user.id;

    const result = await playGameService.resetGame(gameId, userId);

    res.status(200).json({
      success: true,
      message: 'Game reset successfully',
      data: result,
    });
};

module.exports = {
  makeMoveUser,
  getGameState,
  resetGame,
};