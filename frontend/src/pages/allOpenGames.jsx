import React, { useState, useEffect } from "react";
import { getOpenGames, join } from "../services/multiPGameService";
import { useNavigate } from "react-router-dom";

const AllOpenGames = ({ userId }) => {
  const [openGames, setOpenGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    fetchOpenGames();
  }, []);

  const fetchOpenGames = async () => {
    try {
      const response = await getOpenGames();
      if (response.success) setOpenGames(response.data);
      else setMessage("Failed to fetch open games");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Error fetching open games");
    }
  };

  const handleJoinGame = async (gameId) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await join(gameId);
      if (response.success) {
        setMessage(`Joined game successfully! ID: ${response.data.id}`);

        const ws = new WebSocket(`ws://localhost:5000/ws?userId=${userId}`);
        ws.onopen = () => {
          ws.send(JSON.stringify({ type: "joinGame", gameId: response.data.id }));
        };
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "move") console.log("New move received", data);
        };
        
        localStorage.setItem("openGameId", gameId);
        navigate(`/multiPlayerBoard`);
        
      } else {
        setMessage("Failed to join game");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Error joining game");
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Open Multiplayer Games</h2>
      {openGames.length === 0 && <p>No open games available</p>}
      <ul>
        {openGames.map((game) => (
          <li key={game.id}>
            Game ID: {game.id} - Creator: {game.user1_id}{" "}
            <button onClick={() => handleJoinGame(game.id)} disabled={loading}>
              {loading ? "Joining..." : "Join"}
            </button>
          </li>
        ))}
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AllOpenGames;
