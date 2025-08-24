const moveService = require('../service/moveService');

const createMove = async (req, res) => {
  try {
    const { gameId, whoPlayed, boardIndex, sign } = req.body;

    const result = await moveService.createMove({ gameId, whoPlayed, boardIndex, sign });

    if (result.success) {
      res.status(201).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        error: result.error
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

const getAllMoves = async (req, res) => {
  try {
    const result = await moveService.getAllMoves();

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
        count: result.count
      });
    }

    return res.status(400).json({
      success: false,
      message: result.message,
      error: result.error
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  createMove,
  getAllMoves
};
