
const movesRepository = require("../repository/playGameMultiplayerRepository");
const gameRepository = require('../repository/gameRepository');

const WIN_COMBINATIONS = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

const joinGame = async ({ gameId, userId }) => {
  const game = await gameRepository.joinGame(gameId, userId);
  if (!game) {
    throw new Error("Game not found or already has opponent");
  }
  return game;
};

const checkWinner = (moves) => {
  const board = Array(9).fill(null);
  moves.forEach(m => board[m.board_index] = m.sign);

  for (const combo of WIN_COMBINATIONS) {
    const [a,b,c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

const getPlayerSign = (moves, userId) => {
  if (moves.length === 0) return "X";
  const firstPlayerId = Number(moves[0].who_played);
  return Number(userId) === firstPlayerId ? "X" : "O";
};

const buildBoardFromMoves = (moves) => {
  const board = Array(9).fill(null);
  moves.forEach(m => {
    const idx = m.board_index;
    if (idx !== null && idx >= 0 && idx < 9) {
      board[idx] = m.sign;
    }
  });
  return board;
};


const calculateGameState = async (gameId, moves) => {
  const board = buildBoardFromMoves(moves);
  const winnerSign = checkWinner(moves);

  let winnerId = null;
  if (winnerSign) {
    const firstPlayerId = Number(moves[0]?.who_played);
    const secondPlayerId = moves.find(m => Number(m.who_played) !== firstPlayerId)?.who_played;

    winnerId = winnerSign === "X" ? firstPlayerId : Number(secondPlayerId);

    if (winnerId) {
      await gameRepository.updateWinner(gameId, winnerId);
    }
  }

  const isBoardFull = board.every(cell => cell !== null);

  let nextTurnUserId = null;
  if (!winnerId && !isBoardFull && moves.length > 0) {
    const lastMove = moves[moves.length - 1];
    const lastPlayerId = Number(lastMove.who_played);

    const game = await gameRepository.findGameById(gameId);
    if (game) {
      const firstPlayerId = Number(game.userId);
      const secondPlayerId = game.opponentId ? Number(game.opponentId) : null;

      if (secondPlayerId) {
        nextTurnUserId = lastPlayerId === firstPlayerId ? secondPlayerId : firstPlayerId;
      }
    }
  }

  return {
    board,
    moves,
    winnerId,
    isBoardFull,
    nextTurnUserId
  };
};

const getGameState = async (gameId) => {
  const moves = await movesRepository.getMovesByGameId(gameId);
  return calculateGameState(gameId, moves);
};

const makeMove = async ({ gameId, userId, boardIndex }) => {
  const moves = await movesRepository.getMovesByGameId(gameId);
  const lastMove = await movesRepository.getLastMove(gameId);

  const normalizedUserId = Number(userId);
  const lastPlayerId = lastMove ? Number(lastMove.who_played) : null;

  if (lastMove && lastPlayerId === normalizedUserId) {
    throw new Error("Not your turn");
  }

  if (moves.find(m => m.board_index === boardIndex)) {
    throw new Error("Cell already taken");
  }

  const sign = getPlayerSign(moves, normalizedUserId);

  const move = await movesRepository.createMove({
    game_id: gameId,
    user_id: normalizedUserId,
    board_index: boardIndex,
    sign,
    date_time: new Date()
  });

  const updatedMoves = [...moves, move];
  return calculateGameState(gameId, updatedMoves);
};

const resetGame = async (gameId) => {
  await movesRepository.deleteMovesByGameId(gameId);
  await gameRepository.updateWinner(gameId, null);

  const board = Array(9).fill(null);
  return { success: true, board, moves: [], winnerId: null, isBoardFull: false, nextTurnUserId: null };
};

module.exports = { 
  makeMove, 
  resetGame, 
  checkWinner, 
  joinGame, 
  getGameState 
};
