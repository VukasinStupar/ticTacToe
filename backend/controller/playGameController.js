const playGameService = require('../service/playGameService');
const { io } = require('../server');

const makeMoveUser = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { position } = req.body;
    const userId = req.user.id;

    console.log('gameid',gameId);
    console.log('position',position);
    console.log("userId",userId);
    console.log('io',io);
   
    const result = await playGameService.makeMoveUser(gameId, userId, position, io);
    console.log("make move: ",result);

    res.status(200).json({
      success: true,
      message: 'Move made successfully',
      data: result
    });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

const getGameState = async (req, res) => {
  try {
    const { gameId } = req.params;
    console.log("id igre",gameId);

    const state = await playGameService.getGameState(gameId);
    console.log('kakvo je stanje',state);

    res.status(200).json({
      success: true,
      message: 'Game state fetched successfully',
      data: state
    });
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

const resetGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.id;

    const result = await playGameService.resetGame(gameId, userId);

    res.status(200).json({
      success: true,
      message: "Game reset successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  makeMoveUser,
  getGameState,
  resetGame
};
