

import React, { useState, useEffect } from "react";
import { getOpenGames } from "../services/gamePageService";
import { useNavigate } from "react-router-dom";
import "../style/joinGameList.css";

const JoinGameList = () => {
  const [openGames, setOpenGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [joiningGameId, setJoiningGameId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOpenGames() {
      try {
        setLoading(true);
        const res = await getOpenGames();
        setOpenGames(res?.games || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOpenGames();
  }, []);

  const handleJoin = (gameId) => {
    // ovakvu informaciju ne bih cuvao u localStorage (osim ako nije potrebno da ostane sacuvana i nakon reloada browsera ili je potrebno omoguciti korisniku da moze zatvoriti browser i vratiti se u nekom kasnijem trenutku i nastaviti sa igramnjem igre)
    // bez obzira na prethodnu odluku, trebalo bi makar wrapovati koriscenje gameId sa useContextom (ukoliko je podatak potreban i komponentama koje nisu child componente ove komponente) ili samo cuvati u useStateu lokalno i proslediti kao prop u child komponente (moze se i proslediti kao route param)
    localStorage.setItem("joinGameId", gameId);
    navigate("/multiPlayerStartBoard");
  };

  return (
    <div className="join-game-container">
      <h1>🎮 Join an Open Multiplayer Game</h1>
      {loading && <p>Loading...</p>}
      {!loading && openGames.length === 0 && <p>No open games right now.</p>}
      <ul className="games-list">
        {openGames.map(g => (
          <li key={g.id} className="game-item">
            <div>
              <span>Game #{g.id}</span> | <span>Created by User {g.userId}</span> | <span>Mode: {g.typeOfPlay}</span>
            </div>
            <button className="join-btn" onClick={() => handleJoin(g.id)} disabled={joiningGameId === g.id}>
              {joiningGameId === g.id ? "Joining..." : "Join"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JoinGameList;

