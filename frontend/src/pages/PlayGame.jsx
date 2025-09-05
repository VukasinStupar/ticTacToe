import React, { useState, useEffect } from "react";
import { handlePlayerMove, getGameStatus, resetGame } from "../services/playGameService";
import '../style/playGame.css';

const PlayGame = ({ gameId }) => {
  const [board, setBoard] = useState(new Array(9).fill(""));
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      try {
        setLoading(true);
        const status = await getGameStatus(gameId);

        setBoard(status?.data?.board?.map(cell => cell ?? "") ?? new Array(9).fill(""));
        setWinner(status?.data?.winner ?? null);

      } catch (error) {
        console.error("Error fetching game status:", error);
        setBoard(new Array(9).fill(""));
        setWinner(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStatus();
  }, [gameId]);

  const handleMove = async (index) => {
    if (board[index] !== "" || winner) return;

    try {
      setLoading(true);
      const result = await handlePlayerMove(gameId, index);

      const newBoard = result?.data?.board?.map(cell => cell ?? "") ?? new Array(9).fill("");
      setBoard(newBoard);
      setWinner(result?.data?.winner ?? null);

    } catch (error) {
      console.error("Move error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      const result = await resetGame(gameId);

      const newBoard = result?.data?.board?.map(cell => cell ?? "") ?? new Array(9).fill("");
      setBoard(newBoard);
      setWinner(result?.data?.winner ?? null);

    } catch (error) {
      console.error("Reset error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="play-game-container">
      <h1 className="text-2xl font-bold text-center mb-6">🎮 Tic-Tac-Toe</h1>

      {loading && <p className="text-center text-gray-500 mb-4">Loading...</p>}

      <div className="board grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {board.map((cell, index) => (
          <button
            key={index}
            className={`cell border-2 border-gray-400 text-2xl font-bold h-16 w-16 flex items-center justify-center ${cell}`}
            onClick={() => handleMove(index)}
            disabled={cell !== "" || winner || loading}
          >
            {cell}
          </button>
        ))}
      </div>

      {winner && (
        <div className="winner mt-4 text-center">
          {winner === "draw" ? (
            <p className="text-red-500 font-semibold">It's a tie!</p>
          ) : (
            <p className="text-green-500 font-semibold">
              {winner === "X" ? "You win!" : "Computer wins!"}
            </p>
          )}
          <button
            className="reset-button mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleReset}
            disabled={loading}
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayGame;