const express = require('express');
const router = express.Router();
const gameController = require('../controller/gameController');
const errorMiddleware = require('../middleware/errorMiddleware');
const tokenDecode = require('../middleware/tokenDecode');


router.post('/create', tokenDecode, errorMiddleware, gameController.createGame);
router.get('/findGameByLatestId', tokenDecode,  errorMiddleware, gameController.findGameByLatestId);
router.get('/getAllGames', tokenDecode,  errorMiddleware, gameController.getAllGames);

module.exports = router;