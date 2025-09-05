import React, { useState, useEffect, useRef } from "react";
import { getMovesByGameId, createMove, getLastMove } from "../services/moveMultiPlayer";
import { jwtDecode } from "jwt-decode";
import "../style/multiplayerBoard.css"; 
import { useParams } from "react-router-dom";

const MultiPlayerBoard = () => {
  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [loading, setLoading] = useState(true);
  const [lastMove, setLastMove] = useState(null);
  const [message, setMessage] = useState("");
  const [userIdFromToken, setUserIdFromToken] = useState(null);
  const [winner, setWinner] = useState(null);
  const wsRef = useRef(null);
  const { storedGameId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserIdFromToken(decoded.id);
    }
  }, []);
  

  useEffect(() => {
    if (!userIdFromToken) return;
    // const storedGameId = localStorage.getItem("openGameId");//uzeti game id preko params
    if (!storedGameId) return;
    setGameId(storedGameId);

    const fetchMoves = async () => {
      try {
        const movesResponse = await getMovesByGameId(storedGameId);
        if (movesResponse.success) {
          const newBoard = Array(9).fill(null);
          movesResponse.data.forEach((move) => {
            newBoard[move.move_index] = move.sign;
            if (move.winner) setWinner(move.winner);
          });
          setBoard(newBoard);

          const last = await getLastMove(storedGameId);
          if (last.success && last.data) setLastMove(last.data.who_played);
        }
      } catch (err) {
        console.error("Error loading moves", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoves();

    const ws = new WebSocket(`ws://localhost:5000/ws?userId=${userIdFromToken}`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "joinGame", gameId: storedGameId }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "move" && String(data.id_multiplayergame) === String(storedGameId)) {
        setBoard((prev) => {
          const newBoard = [...prev];
          newBoard[data.move_index] = data.sign;
          return newBoard;
        });
        setLastMove(data.who_played);
        if (data.winner) setWinner(data.winner);
      }
    };

    return () => ws.close();
  }, [userIdFromToken]);

  const handleCellClick = async (index) => {
    if (!gameId || board[index] || winner) return;
    if (lastMove === String(userIdFromToken)) {
      setMessage("Not your turn!");
      return;
    }

    const sign = board.filter(Boolean).length % 2 === 0 ? "x" : "o";

    try {
      const movePayload = { move_index: index, sign, who_played: String(userIdFromToken) };
      const res = await createMove(gameId, movePayload);

      if (res.success) {
        setBoard((prev) => {
          const newBoard = [...prev];
          newBoard[index] = sign;
          return newBoard;
        });
        setLastMove(res.data.who_played);
        setMessage("");
        if (res.data.winner) setWinner(res.data.winner);

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: "move", ...res.data, gameId }));
        }
      } else setMessage("Failed to make move.");
    } catch {
      setMessage("Error making move!");
    }
  };

  if (loading) return <p>Loading game...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Multiplayer Game Board</h2>
      <p>Game ID: {gameId}</p>
      {lastMove && <p>Last move by: {lastMove}</p>}
      {message && <p className="error-message">{message}</p>}

      {/* Winner message */}
      {winner && (
        <p className="winner">
          {winner === "draw" ? "The game is a draw!" : `Winner is: ${winner}`}
        </p>
      )}

      {/* Game board */}
      <div className="board-grid">
        {board.map((cell, idx) => (
          <div
            key={idx}
            onClick={() => handleCellClick(idx)}
            className={`board-cell ${cell || winner ? "disabled" : ""}`}
          >
            {cell || ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiPlayerBoard;
