
import React, { useState, useEffect, useRef } from "react";
import { handlePlayerMoveMP, getGameStatusMP, resetGameMP } from "../services/playGameMultiplayerService";
import {io} from "socket.io-client";
import "../style/playGame.css";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || window.location.origin;

function getUserIdFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.id || null;
  } catch {
    return null;
  }
}

function normalizeBoard(board) {
  return board?.map(cell => cell ?? "") ?? new Array(9).fill("");
}

const PlayGameMultiplayer = ({ gameId }) => {
  const [board, setBoard] = useState(new Array(9).fill(""));
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nextTurnUserId, setNextTurnUserId] = useState(null);
  const [currentPlayerSign, setCurrentPlayerSign] = useState(null);

  const socketRef = useRef(null);
  const currentUserId = getUserIdFromToken();

  useEffect(() => {
    async function fetchStatus() {
      try {
        setLoading(true);
        const res = await getGameStatusMP(gameId);
        console.log("Game status:", res);
        const data = res.data;
        setBoard(normalizeBoard(data.board));
        setWinner(data?.winnerId ?? null);
        setNextTurnUserId(data?.nextTurnUserId ?? null);
        
        if (data.moves && data.moves.length > 0) {
          const myMove = data.moves.find(move => move.who_played === currentUserId);
          if (myMove) {
            setCurrentPlayerSign(myMove.sign);
          } else {
            setCurrentPlayerSign(data.moves.length % 2 === 0 ? "X" : "O");
          }
        } else {
          setCurrentPlayerSign("X");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, [gameId, currentUserId]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, { auth: { token: localStorage.getItem("token") } });
    }
    
    const socket = socketRef.current;

    socket.emit("joinGame", gameId);

    socket.on("updateGame", (payload) => {
      if (Number(payload.gameId) !== Number(gameId)) return;
      console.log("Socket update:", payload);
      setBoard(normalizeBoard(payload.board));
      setWinner(payload.winnerId ?? null);
      setNextTurnUserId(payload.nextTurnUserId ?? null);
    });

    socket.on("gameReset", (payload) => {
      if (Number(payload.gameId) !== Number(gameId)) return;
      setBoard(new Array(9).fill(""));
      setWinner(null);
      setNextTurnUserId(null);
      setCurrentPlayerSign("X");
    });

    return () => {
      socket.emit("leaveGame", gameId);
    };
  }, [gameId]);

  const handleMove = async (index) => {
    if (board[index] !== "" || winner || loading) return;

    try {
      setLoading(true);
      const res = await handlePlayerMoveMP(gameId, index);
      console.log("Move response:", res);
      
      // Update state based on response
      setBoard(normalizeBoard(res.data.board));
      setWinner(res.data.winnerId ?? null);
      setNextTurnUserId(res.data.nextTurnUserId ?? null);
    } catch (err) {
      console.error("Move error:", err);
      alert(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      const res = await resetGameMP(gameId);
      setBoard(normalizeBoard(res.data.board));
      setWinner(res.data.winnerId ?? null);
      setNextTurnUserId(res.data.nextTurnUserId ?? null);
      setCurrentPlayerSign("X");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isMyTurn = () => {
    if (winner) return false;
    if (nextTurnUserId === null) return true; 
    return nextTurnUserId === currentUserId;
  };

  return (
    <div className="play-game-container">
      <h1 className="text-2xl font-bold text-center mb-6">🎮 Multiplayer Tic-Tac-Toe</h1>
      {loading && <p className="text-center text-gray-500 mb-4">Loading...</p>}

      <div className="board grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {board.map((cell, index) => (
          <button
            key={index}
            className="cell border-2 border-gray-400 text-2xl font-bold h-16 w-16 flex items-center justify-center"
            onClick={() => handleMove(index)}
            disabled={cell !== "" || !!winner || !isMyTurn() || loading}
          >
            {cell}
          </button>
        ))}
      </div>

      {winner && (
        <div className="winner mt-4 text-center">
          <p className="text-green-500 font-semibold">
            {winner === "draw" ? "It's a draw!" : `Winner: ${winner}`}
          </p>
          <button
            className="reset-button mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleReset}
            disabled={loading}
          >
            Restart Game
          </button>
        </div>
      )}

      {!winner && (
        <p className="text-center mt-4 text-sm">
          {isMyTurn() ? "Your turn" : "Opponent's turn"}
          {currentPlayerSign && ` (You are: ${currentPlayerSign})`}
        </p>
      )}
    </div>
  );
};

export default PlayGameMultiplayer;