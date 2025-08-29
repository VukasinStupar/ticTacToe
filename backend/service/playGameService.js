const playGameRepo = require("../repository/playGameRepository");

function checkWinner(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (board.every(cell => cell)) return "draw";
  return null;
}

// Ova funkcija definitivno radi previse stvari i teska je za ispratiti, bilo bi dobro izanalizirati i pokusati izvuci nekoliko pomocnih funkcija koje bi se koristile
const makeMoveUser = async (gameId, userId, position, io) => {
  const game = await playGameRepo.getGameById(gameId);
  if (!game) throw new Error("Game not found");
  if (game.who_win) throw new Error("Game already finished");

  const moves = await playGameRepo.getMovesByGameId(gameId);
  const board = Array(9).fill(null);
  moves.forEach(move => board[move.board_index] = move.sign);

  if (board[position]) throw new Error("Position already taken");

  board[position] = "X";
  await playGameRepo.createMove({
    game_id: gameId,
    who_played: userId.toString(),
    board_index: position,
    sign: "X",
    date_time: new Date()
  });

  if (io) io.to(`game_${gameId}`).emit("updateBoard", { board, currentTurn: "computer" });

  let result = checkWinner(board);
  if (result) {
    await playGameRepo.updateGameWinner(gameId, result);
    if (io) io.to(`game_${gameId}`).emit("gameOver", { board, winner: result });
    return { board, winner: result };
  }

  const emptyPositions = board.map((v,i) => v ? null : i).filter(v => v !== null);
  if (emptyPositions.length > 0) {
    const computerMove = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
    board[computerMove] = "O";

    await playGameRepo.createMove({
      game_id: gameId,
      who_played: "computer",
      board_index: computerMove,
      sign: "O",
      date_time: new Date()
    });

    result = checkWinner(board);
    if (result) {
      await playGameRepo.updateGameWinner(gameId, result);
      if (io) io.to(`game_${gameId}`).emit("gameOver", { board, winner: result });
    } else {
      if (io) io.to(`game_${gameId}`).emit("updateBoard", { board, currentTurn: "user" });
    }
  }

  return { board, winner: result || null };
};

const getGameState = async (gameId) => {
  const game = await playGameRepo.getGameById(gameId);
  if (!game) throw new Error("Game not found");

  const moves = await playGameRepo.getMovesByGameId(gameId);
  const board = Array(9).fill(null);
  moves.forEach(move => board[move.board_index] = move.sign);

  return { board, winner: game.who_win };
};

const resetGame = async (gameId, userId) => {
  const game = await playGameRepo.getGameById(gameId);
  if (!game) throw new Error("Game not found");

  await playGameRepo.deleteMovesByGameId(gameId);

  await playGameRepo.updateGameWinner(gameId, null);

  const board = Array(9).fill(null);
  return { board, winner: null };
};

module.exports = {
  makeMoveUser,
  getGameState,
  resetGame
};
