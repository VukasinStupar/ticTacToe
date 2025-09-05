import React, { useState, useEffect, useRef } from "react";
import { create, getOpenGames, join } from "../services/multiPGameService";
import { getMovesByGameId, createMove, getLastMove } from "../services/moveMultiPlayer";
import { useNavigate } from "react-router-dom";
import "../style/createMultiPgame.css";

const MultiplayerGame = ({ userId }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [gameId, setGameId] = useState(null);
  const [lastMoveBy, setLastMoveBy] = useState(null);
  const [lastSign, setLastSign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [winner, setWinner] = useState(null);
  const [openGames, setOpenGames] = useState([]);
  const wsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOpenGames();
  }, []);

  const fetchOpenGames = async () => {
    try {
      const res = await getOpenGames();
      if (res.success) setOpenGames(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const connectWS = (id) => {
    const ws = new WebSocket(`ws://localhost:5000/ws?userId=${userId}`);
    wsRef.current = ws;
    ws.onopen = () => ws.send(JSON.stringify({ type: "joinGame", gameId: id }));
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "move" && String(data.gameId) === String(id)) {
        setBoard((prev) => {
          const newBoard = [...prev];
          newBoard[data.move_index] = data.sign;
          return newBoard;
        });
        setLastMoveBy(data.who_played);
        setLastSign(data.sign);
        if (data.winner) setWinner(data.winner);
      }
    };
    ws.onerror = (err) => console.error("WebSocket error:", err);
  };

  const handleCreateGame = async () => {
    setLoading(true);
    try {
      const res = await create();
      if (res.success) {
        const id = res.data.id;
        setGameId(id);
        connectWS(id);
        // localStorage.setItem("openGameId", id);//zameniti sa params ili izbaciti ako je ne potrebno
        setMessage(`Game created! ID: ${id}`);
        setWinner(null);

        const movesRes = await getMovesByGameId(id);
        if (movesRes.success) {
          const newBoard = Array(9).fill(null);
          movesRes.data.forEach((move) => (newBoard[move.move_index] = move.sign));
          setBoard(newBoard);
        } else {

        setBoard(Array(9).fill(null));
        const newBoard = Array(9).fill(null);
        setBoard(newBoard);

        }
        
        const last = await getLastMove(id);
        if (last.success && last.data) {
          setLastMoveBy(last.data.who_played);
          setLastSign(last.data.sign);
        }

      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async (id) => {
    setLoading(true);
    try {
      const res = await join(id);
      if (res.success) {
        setGameId(id);
        connectWS(id);
        // localStorage.setItem("openGameId", id);//game id proslediti uz pomoc params
        // navigate("/multiPlayerBoard", id);

        setWinner(null);

        const movesRes = await getMovesByGameId(id);
        if (movesRes.success) {
          const newBoard = Array(9).fill(null);
          movesRes.data.forEach((move) => (newBoard[move.move_index] = move.sign));
          setBoard(newBoard);
        }

        const last = await getLastMove(id);
        if (last.success && last.data) {
          setLastMoveBy(last.data.who_played);
          setLastSign(last.data.sign);
        }

         navigate("/multiPlayerBoard", id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = async (index) => {
    if (!gameId || board[index] || winner) return;
    if (lastMoveBy === String(userId)) {
      alert("Not your turn!");
      return;
    }
    const sign = lastSign === "x" ? "o" : "x";

    try {
      const payload = { move_index: index, sign, who_played: String(userId) };
      const res = await createMove(gameId, payload);

      if (res.success) {
        setBoard((prev) => {
          const newBoard = [...prev];
          newBoard[index] = sign;
          return newBoard;
        });

        setLastMoveBy(String(userId));
        setLastSign(sign);

        if (res.data.winner) setWinner(res.data.winner);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: "move", ...res.data, gameId }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mpg-container">
      <h2 className="mpg-title">👽 Multiplayer TicTacToe 👽</h2>

      {!gameId && (
        <div className="mpg-start">
          <button className="mpg-btn" onClick={handleCreateGame} disabled={loading}>
            {loading ? "Creating..." : "Create Game"}
          </button>
          <h3>Or join an open game:</h3>
          <ul>
            {openGames.map((g) => (
              <li key={g.id}>
                Game ID: {g.id}, Creator: {g.user1_id}{" "}
                <button className="mpg-btn" onClick={() => handleJoinGame(g.id)} disabled={loading}>
                  {loading ? "Joining..." : "Join"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {gameId && (
        <div className="mpg-board-wrapper">
          <p>Game ID: {gameId}</p>
          {lastMoveBy && <p>Last move by: {lastMoveBy}, Sign: {lastSign}</p>}
          {winner && <p className="mpg-winner">Winner: {winner.toUpperCase()}</p>}

          <div className="mpg-board">
            {board.map((cell, idx) => (
              <div
                key={idx}
                className={`mpg-cell ${cell ? "filled" : ""}`}
                onClick={() => !winner && handleCellClick(idx)}
              >
                {cell || ""}
              </div>
            ))}
          </div>
        </div>
      )}

      {message && <p className="mpg-message">{message}</p>}
    </div>
  );
};

export default MultiplayerGame;
