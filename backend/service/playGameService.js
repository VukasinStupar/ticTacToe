const playGameRepo = require('../repository/playGameRepository');
const {
  AuthenticationError,
  ValidationError,
  NotFoundError,
} = require('../utils/errors'); 

function checkWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every((cell) => cell)) return 'draw';
  return null;
}

const makeMoveUser = async (gameId, userId, position, io) => {
  const game = await validateGame(gameId);
  const board = await getGameBoard(gameId);
  
  validateMove(board, position);

  await makeMove(gameId, userId.toString(), position, 'X', board);
  emitBoardUpdate(io, gameId, board, 'computer');

  let winner = checkWinner(board);
  if (winner) {
    return await finishGame(gameId, io, board, winner);
  }

  const emptyPositions = getEmptyPositions(board);
  if (emptyPositions.length === 0) {
    return { board, winner: null };
  }

  await makeComputerMove(gameId, board, emptyPositions);
  winner = checkWinner(board);

  if (winner) {
    await finishGame(gameId, io, board, winner);
  } else {
    emitBoardUpdate(io, gameId, board, 'user');
  }

  return { board, winner: winner || null };
};

const validateGame = async (gameId) => {
  const game = await playGameRepo.getGameById(gameId);
  if (!game) throw new NotFoundError('Game not found');
  if (game.who_win) throw new ValidationError('Game already finished');
  return game;
};

const getGameBoard = async (gameId) => {
  const moves = await playGameRepo.getMovesByGameId(gameId);
  const board = Array(9).fill(null);
  moves.forEach((move) => (board[move.board_index] = move.sign));
  return board;
};

const validateMove = (board, position) => {
  if (board[position]) throw new ValidationError('Position already taken');
};

const makeMove = async (gameId, player, position, sign, board) => {
  board[position] = sign;
  await playGameRepo.createMove({
    game_id: gameId,
    who_played: player,
    board_index: position,
    sign,
    date_time: new Date(),
  });
};

const makeComputerMove = async (gameId, board, emptyPositions) => {
  const computerMove = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  await makeMove(gameId, 'computer', computerMove, 'O', board);
};

const emitBoardUpdate = (io, gameId, board, currentTurn) => {
  if (io) {
    io.to(`game_${gameId}`).emit('updateBoard', { board, currentTurn });
  }
};

const finishGame = async (gameId, io, board, winner) => {
  await playGameRepo.updateGameWinner(gameId, winner);
  if (io) {
    io.to(`game_${gameId}`).emit('gameOver', { board, winner });
  }
  return { board, winner };
};

const getEmptyPositions = (board) => {
  return board
    .map((v, i) => (v ? null : i))
    .filter((v) => v !== null);
};

const getGameState = async (gameId) => {
  const game = await playGameRepo.getGameById(gameId);
  if (!game) throw new NotFoundError('Game not found');

  const moves = await playGameRepo.getMovesByGameId(gameId);
  const board = Array(9).fill(null);
  moves.forEach((move) => (board[move.board_index] = move.sign));

  return { board, winner: game.who_win };
};

const resetGame = async (gameId) => {
  const game = await playGameRepo.getGameById(gameId);
  if (!game) throw new NotFoundError('Game not found');

  await playGameRepo.deleteMovesByGameId(gameId);
  await playGameRepo.updateGameWinner(gameId, null);

  const board = Array(9).fill(null);
  return { board, winner: null };
};

module.exports = {
  makeMoveUser,
  getGameState,
  resetGame,
};