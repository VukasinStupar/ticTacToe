import React, { useState, useEffect } from "react";
import { getGameStatusMP, handlePlayerMoveMP } from "../services/playGameMultiplayerService";
import "../style/playGame.css";

const MultiPlayerStartBoard = () => {
  const gameId = localStorage.getItem("joinGameId");
  console.log('id igre iz localstorage:', gameId);

  const [board, setBoard] = useState(new Array(9).fill(""));
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [playerSign, setPlayerSign] = useState(null);

  useEffect(() => {
    if (!gameId) return;

    async function fetchStatus() {
      try {
        setLoading(true);
        const status = await getGameStatusMP(gameId);
        setBoard(status?.data?.board?.map(cell => cell ?? "") ?? new Array(9).fill(""));
        setWinner(status?.data?.winner ?? null);
        setCurrentTurn(status?.data?.currentTurn ?? null);
        setPlayerSign(status?.data?.playerSign ?? null);
      } catch (err) {
        console.error("Error fetching multiplayer status:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, [gameId]);

  const handleMove = async (index) => {
    if (board[index] !== "" || winner || currentTurn !== playerSign) return;

    try {
      setLoading(true);
      const result = await handlePlayerMoveMP(gameId, index);
      setBoard(result?.data?.board?.map(cell => cell ?? "") ?? board);
      setWinner(result?.data?.winner ?? null);
      console.log("red", result);
      setCurrentTurn(result?.data?.currentTurn ?? null);
    } catch (err) {
      console.error("Move error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="play-game-container">
      <h1 className="text-2xl font-bold text-center mb-6">🎮 Multiplayer Tic-Tac-Toe</h1>

      {loading && <p className="text-center text-gray-500 mb-4">Loading...</p>}

      <div className="board grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {board.map((cell, index) => (
          <button
            key={index}
            className={`cell border-2 border-gray-400 text-2xl font-bold h-16 w-16 flex items-center justify-center ${cell}`}
            onClick={() => handleMove(index)}
            disabled={cell !== "" || winner || loading || currentTurn !== playerSign}
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
              {winner === playerSign ? "You win!" : "Opponent wins!"}
            </p>
          )}
        </div>
      )}

      {!winner && (
        <p className="text-center mt-2">
          {currentTurn === playerSign ? "Your turn!" : "Opponent's turn..."}
        </p>
      )}
    </div>
  );
};

export default MultiPlayerStartBoard;

