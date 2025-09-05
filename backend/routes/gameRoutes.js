const express = require('express');
const router = express.Router();
const gameController = require('../controller/gameController');
const authenticateToken = require('../middleware/auth');

router.post('/create', authenticateToken, gameController.createGame);
router.get('/getAllGames', authenticateToken, gameController.getAllGames);
router.put('/:gameId', authenticateToken, gameController.updateWinner);

module.exports = router;
