const express = require("express");
const router = express.Router();
const playGameMultiplayerController = require("../controller/playGameMultiplayerController");
const authenticateToken = require("../middleware/auth");

router.post("/:gameId/move", authenticateToken, playGameMultiplayerController.makeMoveUser);
router.get("/:gameId", authenticateToken, playGameMultiplayerController.getGameState);
router.post("/:gameId/reset", authenticateToken, playGameMultiplayerController.resetGame);
router.post("/:gameId/join", authenticateToken, playGameMultiplayerController.joinExistingGame);

module.exports = router;