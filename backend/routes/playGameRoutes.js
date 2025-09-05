const express = require('express');
const router = express.Router();
const playGameController = require('../controller/playGameController');
const authenticateToken = require('../middleware/auth');

router.post('/:gameId/move', authenticateToken, playGameController.makeMoveUser);

router.get('/:gameId', authenticateToken, playGameController.getGameState);

router.post('/:gameId/reset', authenticateToken, playGameController.resetGame);


module.exports = router;
