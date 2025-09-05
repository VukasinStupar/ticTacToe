import React from "react";
import { useNavigate } from "react-router-dom";


const SingleMultiPlayer = () => {
  const navigate = useNavigate();

  const handleSingleClick = () => {
        navigate("/createNewGame");

  };

  const handleMultiClick = () => {
    navigate("/createMultiplayerGame");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-3xl font-bold text-white mb-8">Choose Game Mode</h1>
      <div className="flex space-x-6">
        <button
          onClick={handleSingleClick}
          className="px-6 py-3 rounded-2xl bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 transition"
        >
          Single Player
        </button>
        <button
          onClick={handleMultiClick}
          className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
        >
          Multiplayer
        </button>
      </div>
    </div>
  );
};


export default SingleMultiPlayer;
