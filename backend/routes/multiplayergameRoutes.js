// backend/routes/multiplayerGameRoutes.js
const express = require('express');
const router = express.Router();
const multiplayerGameController = require('../controller/multiplayergameController');
const authenticateToken = require('../middleware/auth');

router.get('/open', authenticateToken, multiplayerGameController.getOpenGames);

router.post('/create', authenticateToken, multiplayerGameController.createGame);

router.get('/all', authenticateToken, multiplayerGameController.getAllGames);

router.get(
  '/:gameId',
  authenticateToken,
  multiplayerGameController.getGameById,
);


router.post(
  '/:gameId/winner',
  authenticateToken,
  multiplayerGameController.setWinner,
);

router.post(
  '/:gameId/join',
  authenticateToken,
  multiplayerGameController.joinExistingGame,
);

module.exports = router;
