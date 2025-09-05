const multiplayergameService = require('../service/multiplayergameService');
const { getWSS } = require('../socket');

const rooms = {};

const createGame = async (req, res) => {

    const user1_id = req.user.id;

    const game = await multiplayergameService.createGame(user1_id);

    const wss = getWSS();

    wss.clients.forEach((client) => {
      if (client.userId === user1_id && client.readyState === 1) {
        const roomName = `game_${game.id}`;
        if (!rooms[roomName]) rooms[roomName] = new Set();
        rooms[roomName].add(client.id);
        client.roomName = roomName;
        console.log(`User ${user1_id} joined room ${roomName} automatically`);
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Game created successfully',
      data: game,
    });
};

const getAllGames = async (req, res) => {

    const games = await multiplayergameService.getAllGames();
    return res.status(200).json({
      success: true,
      message: 'All games fetched successfully',
      data: games,
    });
};

const getGameById = async (req, res) => {

    const { gameId } = req.params;
    const game = await multiplayergameService.getGameById(Number(gameId));
    return res.status(200).json({
      success: true,
      message: 'Game fetched successfully',
      data: game,
    });
};

const setWinner = async (req, res) => {

    const { gameId } = req.params;
    const { winner } = req.body;
    const game = await multiplayergameService.setWinner(Number(gameId), winner);
    return res.status(200).json({
      success: true,
      message: 'Winner set successfully',
      data: game,
    });
};

const joinExistingGame = async (req, res) => {

    const { gameId } = req.params;

    const user2_id = req.user.id;

    const game = await multiplayergameService.joinExistingGame(
      Number(gameId),
      user2_id,
    );

    const wss = getWSS();
    wss.clients.forEach((client) => {
      if (client.userId === user2_id && client.readyState === 1) {
        const roomName = `game_${gameId}`;
        if (!rooms[roomName]) rooms[roomName] = new Set();
        rooms[roomName].add(client.id);
        client.room = roomName;
        console.log(`User ${user2_id} joined room ${roomName}`);
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Joined game successfully',
      data: game,
    });
};

const getOpenGames = async (req, res) => {

    const games = await multiplayergameService.getOpenGames();
    return res.status(200).json({
      success: true,
      message: 'Open games fetched successfully',
      data: games,
    });
    
};


module.exports = {
  createGame,
  getAllGames,
  getGameById,
  setWinner,
  joinExistingGame,
  getOpenGames,
};