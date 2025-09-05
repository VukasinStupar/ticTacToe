// backend/controller/multiplayerGameMovesController.js
const multiplayerGameMovesService = require('../service/multiplayergamemoveService');

const getMovesByGameId = async (req, res) => {
    const { id_multiplayergame } = req.params;
    const moves = await multiplayerGameMovesService.getMovesByGameId(Number(id_multiplayergame));
    return res.status(200).json({ success: true, message: "Moves fetched successfully", data: moves });
};

const createMove = async (req, res) => {
    const { id_multiplayergame } = req.params;
    const { move_index, sign } = req.body;
    const who_played = req.user.id;

    const move = await multiplayerGameMovesService.createMove({
      id_multiplayergame: Number(id_multiplayergame),
      move_index,
      sign,
      who_played
      
    });

    
    let winner = null;
      winner = await multiplayerGameMovesService.checkWinner(Number(id_multiplayergame));

    return res.status(200).json({
      success: true,
      message: "Move created successfully",
      data: { ...move, winner }
    });
};

const getLastMove = async (req, res) => {

    const { id_multiplayergame } = req.params;

    const move = await multiplayerGameMovesService.getLastMove(Number(id_multiplayergame));

    return res.status(200).json({ success: true, message: "Last move fetched successfully", data: move });
};

module.exports = {
  getMovesByGameId,
  createMove,
  getLastMove
};