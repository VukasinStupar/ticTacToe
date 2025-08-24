const gameService = require('../service/gameService');

const createGame = async (req, res) => {
  try {
    const { userId, datetime, typeOfPlay, whoWin } = req.body;

    const result = await gameService.createGame({
      userId,
      datetime: datetime || new Date(),
      typeOfPlay,
      whoWin
    });

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

const getAllGames = async (req, res) => {
  try {
    const result = await gameService.getAllGames();

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

const getGameById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await gameService.getGameById(parseInt(id));

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      if (result.message === "Game not found") {
        res.status(404).json({
          success: false,
          message: result.message
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  createGame,
  getAllGames,
  getGameById
};
