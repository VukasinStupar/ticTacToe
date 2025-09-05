const movesRepository = require('../repository/multiplayergamemovesRepository');
const {
  AuthenticationError,
  ValidationError,
  NotFoundError,
} = require('../utils/errors'); // updated import

const getMovesByGameId = async (id_multiplayergame) => {
  if (!id_multiplayergame) throw new ValidationError('id_multiplayergame is not sent!');

  const moves = await movesRepository.getMovesByGameId(id_multiplayergame);
  if (!moves || moves.length === 0) throw new NotFoundError("Can't find moves by game id");

  return moves;
};

const createMove = async ({ id_multiplayergame, move_index, sign, who_played }) => {
  if (!id_multiplayergame || move_index === undefined || !sign || !who_played)
    throw new ValidationError('Missing required fields for creating move!');

  const move = await movesRepository.createMove({
    id_multiplayergame,
    move_index,
    sign,
    who_played,
    date_time: new Date(),
  });
  if (!move) throw new Error("Can't create move");

  const winner = await checkWinner(id_multiplayergame);

  return { ...move, winner };
};


const getLastMove = async (id_multiplayergame) => {
  if (!id_multiplayergame) throw new ValidationError('id_multiplayergame is not sent!');

  const lastMove = await movesRepository.getLastMove(id_multiplayergame);
  
  if (!lastMove) return null;

  return lastMove;
};


const checkWinner = async (id_multiplayergame) => {
  const moves = await getMovesByGameId(id_multiplayergame);
  const board = Array(9).fill(null);

  moves.forEach((m) => {
    board[m.move_index] = m.sign;
  });

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.every((cell) => cell)) return 'draw';

  return null;
};

module.exports = {
  getMovesByGameId,
  createMove,
  getLastMove,
  checkWinner,
};