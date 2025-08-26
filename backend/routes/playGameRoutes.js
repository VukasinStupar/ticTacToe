const express = require("express");
const router = express.Router();
const controller = require("../controller/playGameController");
const errorMiddleware = require('../middleware/errorMiddleware');
const tokenDecode = require('../middleware/tokenDecode');


router.post("/:gameId/move",tokenDecode, errorMiddleware, controller.move);
router.get("/:gameId/status",tokenDecode, errorMiddleware, controller.status);
router.post("/:gameId/reset",tokenDecode, errorMiddleware, controller.reset);

module.exports = router;