const repo = require("../repository/playGameRepository");

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

async function getBoardFromDB(gameId) {
  const moves = await repo.findGameById(gameId);
  let board = new Array(9).fill("");
  for (let move of moves) {
    board[move.board_index] = move.sign;
  }
  return board;
}

async function checkWinner(board) {
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (!board.includes("")) return "Tie";
  return null;
}

async function handlePlayerMove(gameId, index, sign, whoPlayed = "user") {
  const board = await getBoardFromDB(gameId);
  const winner = await checkWinner(board);

  if (board[index] !== "" || winner) {
    return { success: false, message: "Invalid move!", board, winner };
  }

  await repo.insertMove(gameId, whoPlayed, index, sign);
  const updatedBoard = await getBoardFromDB(gameId);
  const newWinner = await checkWinner(updatedBoard);

  return { success: true, board: updatedBoard, winner: newWinner };
}

async function handleComputerMove(gameId) {
  const board = await getBoardFromDB(gameId);

  let availableMoves = board
    .map((value, index) => (value === "" ? index : -1))
    .filter(index => index !== -1);

  if (availableMoves.length === 0) {
    return { success: false, message: "No available moves", board };
  }

  const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];

  await repo.insertMove(gameId, "computer", randomMove, "O");
  const updatedBoard = await getBoardFromDB(gameId);
  const winner = await checkWinner(updatedBoard);

  return { success: true, board: updatedBoard, winner };
}

async function resetGame(gameId) {
  await repo.resetGame(gameId);
  return { success: true, board: new Array(9).fill(""), winner: null };
}

async function getGameStatus(gameId) {
  const board = await getBoardFromDB(gameId);
  const winner = await checkWinner(board);
  return { board, winner };
}

module.exports = {
  handlePlayerMove,
  handleComputerMove,
  checkWinner,
  resetGame,
  getGameStatus
};
