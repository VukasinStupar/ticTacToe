
import React, { useState, useEffect } from "react";
import { createGame } from "../services/gamePageService";
import PlayGame from "./PlayGame";
import PlayGameMultiplayer from "./PlayGameMultiplayer";
import "../style/createGame.css";
import { useNavigate } from 'react-router-dom';

const CreateNewGame = () => {
  const [newGame, setNewGame] = useState({ typeOfPlay: "" });
  const [gameSaved, setGameSaved] = useState(false);
  const [latestId, setLatestId] = useState(null);
  const navigate = useNavigate();

  // ne vidim poentu u ovom useEffectu, mogao si samo proslediti ovu datetime vrednosti pri definisanju useState varijable
  useEffect(() => {
    setNewGame(prev => ({ ...prev, datetime: new Date().toISOString() }));
  }, []);

  const handleCreateGame = async () => {
    if (!newGame.typeOfPlay) return alert("Type of play is required.");

    try {
      const createdGame = await createGame(newGame);
      const gameId = createdGame?.game?.[0]?.id;
      if (!gameId) return alert("Failed to get game ID");

      setLatestId(gameId);
      setGameSaved(true);
    } catch (err) {
      console.error(err);
      alert("Error creating game");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🎮 Games Dashboard</h1>

      <div className="mb-4">
        <strong>Type of Play:</strong>
        <div className="flex space-x-4 mt-2">
          <label>
            {/* Najbolje je u htmlu ostaviti samo display logiku, onChange funkcije bi mogao lokalno definisati iznad return bloka*/}
            <input type="radio" name="typeOfPlay" value="SINGLE_PLAYER" checked={newGame.typeOfPlay === "SINGLE_PLAYER"} onChange={(e) => { setNewGame({ ...newGame, typeOfPlay: e.target.value }); setGameSaved(false); }} /> Single Player
          </label>
          <label>
            <input type="radio" name="typeOfPlay" value="MULTI_PLAYER" checked={newGame.typeOfPlay === "MULTI_PLAYER"} onChange={(e) => { setNewGame({ ...newGame, typeOfPlay: e.target.value }); setGameSaved(false); }} /> Multiplayer
          </label>
        </div>
      </div>

      {!gameSaved && newGame.typeOfPlay && <button onClick={handleCreateGame} className="bg-green-500 px-4 py-2 text-white rounded">Create Game</button>}

      {gameSaved && latestId && (
        <div className="mt-6">
          {newGame.typeOfPlay === "SINGLE_PLAYER" ? <PlayGame gameId={latestId} /> : <PlayGameMultiplayer gameId={latestId} />}
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Join a Multiplayer Game</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => navigate("/joinGameList")}>Browse Open Games</button>
      </div>
    </div>
  );
};

export default CreateNewGame;

