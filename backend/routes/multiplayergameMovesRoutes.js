// backend/routes/multiplayerGameMovesRoutes.js
const express = require('express');
const router = express.Router();
const multiplayerGameMovesController = require('../controller/multiplayergameMovesController');
const authenticateToken = require('../middleware/auth');

router.get('/:id_multiplayergame/moves', authenticateToken, multiplayerGameMovesController.getMovesByGameId);

router.post('/:id_multiplayergame/move', authenticateToken, multiplayerGameMovesController.createMove);

router.get('/:id_multiplayergame/last-move', authenticateToken, multiplayerGameMovesController.getLastMove);

module.exports = router;
