import React, { useState } from "react";
import { createGame } from "../services/gamePageService";
import PlayGame from "./PlayGame";
import "../style/createGame.css";

const CreateNewGame = () => {
  const [gameSaved, setGameSaved] = useState(false);
  const [latestId, setLatestId] = useState(null);

  const handleCreateGame = async () => {
    try {
      const newGame = {
        datetime: new Date().toISOString(),
      };

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
      <h1 className="text-2xl font-bold mb-6">🎮 Single Player Game</h1>

      {!gameSaved && (
        <button
          onClick={handleCreateGame}
          className="bg-green-500 px-4 py-2 text-white rounded"
        >
          Create Single Player Game
        </button>
      )}

      {gameSaved && latestId && (
        <div className="mt-6">
          <PlayGame gameId={latestId} />
        </div>
      )}
    </div>
  );
};

export default CreateNewGame;
