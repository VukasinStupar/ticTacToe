
// import React, { useState, useEffect, useRef } from "react";
// import { handlePlayerMoveMP, getGameStatusMP, resetGameMP } from "../services/playGameMultiplayerService";
// import io from "socket.io-client";
// import "../style/playGame.css";

// const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || window.location.origin;

// function getUserIdFromToken() {
//   try {
//     const token = localStorage.getItem("token");
    
//     if (!token) return null;
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload?.id || null;
//   } catch {
//     return null;
//   }
// }

// const PlayGameMultiplayer = ({ gameId }) => {
//   const [board, setBoard] = useState(new Array(9).fill(""));
//   const [winner, setWinner] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [nextTurnUserId, setNextTurnUserId] = useState(null);

//   const socketRef = useRef(null);
//   const currentUserId = getUserIdFromToken();

//   // const normData = (res) => res?.data?.data ?? res?.data;
//   const normData = (res) => res?.data ?? {};
//   useEffect(() => {
//     async function fetchStatus() {
//       try {
//         setLoading(true);
//         const res = await getGameStatusMP(gameId);
//         const data = normData(res);
//         setBoard(data?.board?.map(cell => cell ?? "") ?? new Array(9).fill(""));
//         setWinner(data?.winnerId ?? null);
//         setNextTurnUserId(data?.nextTurnUserId ?? null);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchStatus();
//   }, [gameId]);

//   useEffect(() => {
//     socketRef.current = io(SOCKET_URL, { auth: { token: localStorage.getItem("token") } });
//     const socket = socketRef.current;

//     socket.emit("joinGame", gameId);

//     socket.on("updateGame", (payload) => {
//       if (Number(payload.gameId) !== Number(gameId)) return;
//       setBoard(payload.board?.map(cell => cell ?? "") ?? new Array(9).fill(""));
//       setWinner(payload.winner ?? null);
//       setNextTurnUserId(payload.nextTurnUserId ?? null);
//     });

//     socket.on("gameReset", (payload) => {
//       if (Number(payload.gameId) !== Number(gameId)) return;
//       setBoard(new Array(9).fill(""));
//       setWinner(null);
//       setNextTurnUserId(null);
//     });

//     return () => {
//       socket.emit("leaveGame", gameId);
//       socket.disconnect();
//     };
//   }, [gameId]);

//   const handleMove = async (index) => {
//     if (board[index] !== "" || winner || nextTurnUserId !== currentUserId) return;

//     try {
//       setLoading(true);
//       const res = await handlePlayerMoveMP(gameId, index);
//       const data = normData(res);
//       setBoard(data?.board?.map(cell => cell ?? "") ?? new Array(9).fill(""));
//       setWinner(data?.winnerId ?? null);
//       setNextTurnUserId(data?.nextTurnUserId ?? null);
//     } catch (err) {
//       console.error(err);
//       alert(err?.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = async () => {
//     try {
//       setLoading(true);
//       const res = await resetGameMP(gameId);
//       const data = normData(res);
//       setBoard(data?.board?.map(cell => cell ?? "") ?? new Array(9).fill(""));
//       setWinner(data?.winnerId ?? null);
//       setNextTurnUserId(null);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="play-game-container">
//       <h1 className="text-2xl font-bold text-center mb-6">🎮 Multiplayer Tic-Tac-Toe</h1>
//       {loading && <p className="text-center text-gray-500 mb-4">Loading...</p>}

//       <div className="board grid grid-cols-3 gap-2 max-w-xs mx-auto">
//         {board.map((cell, index) => (
//           <button
//             key={index}
//             className="cell border-2 border-gray-400 text-2xl font-bold h-16 w-16 flex items-center justify-center"
//             onClick={() => handleMove(index)}
//             disabled={cell !== "" || !!winner || nextTurnUserId !== currentUserId}
//           >
//             {cell}
//           </button>
//         ))}
//       </div>

//       {winner && (
//         <div className="winner mt-4 text-center">
//           <p className="text-green-500 font-semibold">Winner: {winner}</p>
//           <button className="reset-button mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleReset} disabled={loading}>Restart Game</button>
//         </div>
//       )}

//       {!winner && (
//         <p className="text-center mt-4 text-sm">
//           {nextTurnUserId === null ? "Waiting for opponent..." : nextTurnUserId === currentUserId ? "Your turn" : "Opponent's turn"}
//         </p>
//       )}
//     </div>
//   );
// };

// export default PlayGameMultiplayer;


import React, { useState, useEffect, useRef } from "react";
import { handlePlayerMoveMP, getGameStatusMP, resetGameMP } from "../services/playGameMultiplayerService";
import io from "socket.io-client";
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

const normData = (res) => res?.data ?? {};
const normalizeBoard = (board) => board?.map(cell => cell ?? "") ?? new Array(9).fill("");

const PlayGameMultiplayer = ({ gameId }) => {
  const [board, setBoard] = useState(new Array(9).fill(""));
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nextTurnUserId, setNextTurnUserId] = useState(null);

  const socketRef = useRef(null);
  const currentUserId = getUserIdFromToken();

  useEffect(() => {
    async function fetchStatus() {
      try {
        setLoading(true);
        const res = await getGameStatusMP(gameId);
        const data = normData(res);
        setBoard(normalizeBoard(data?.board));
        setWinner(data?.winnerId ?? null);
        setNextTurnUserId(data?.nextTurnUserId ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, [gameId]);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { auth: { token: localStorage.getItem("token") } });
    const socket = socketRef.current;

    socket.emit("joinGame", gameId);

    socket.on("updateGame", (payload) => {
      if (Number(payload.gameId) !== Number(gameId)) return;
      setBoard(normalizeBoard(payload.board));
      setWinner(payload.winner ?? null);
      setNextTurnUserId(payload.nextTurnUserId ?? null);
    });

    socket.on("gameReset", (payload) => {
      if (Number(payload.gameId) !== Number(gameId)) return;
      setBoard(new Array(9).fill(""));
      setWinner(null);
      setNextTurnUserId(null);
    });

    return () => {
      socket.emit("leaveGame", gameId);
      socket.disconnect();
    };
  }, [gameId]);

  const handleMove = async (index) => {
    if (board[index] !== "" || winner || nextTurnUserId !== currentUserId) return;

    try {
      setLoading(true);
      const res = await handlePlayerMoveMP(gameId, index);
      const data = normData(res);
      setBoard(normalizeBoard(data?.board));
      setWinner(data?.winnerId ?? null);
      setNextTurnUserId(data?.nextTurnUserId ?? null);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      const res = await resetGameMP(gameId);
      const data = normData(res);
      setBoard(normalizeBoard(data?.board));
      setWinner(data?.winnerId ?? null);
      setNextTurnUserId(null);
    } catch (err) {
      console.error(err);
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
            className="cell border-2 border-gray-400 text-2xl font-bold h-16 w-16 flex items-center justify-center"
            onClick={() => handleMove(index)}
            disabled={cell !== "" || !!winner || nextTurnUserId !== currentUserId}
          >
            {cell}
          </button>
        ))}
      </div>

      {winner && (
        <div className="winner mt-4 text-center">
          <p className="text-green-500 font-semibold">Winner: {winner}</p>
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
          {nextTurnUserId === null
            ? "Waiting for opponent..."
            : nextTurnUserId === currentUserId
            ? "Your turn"
            : "Opponent's turn"}
        </p>
      )}
    </div>
  );
};

export default PlayGameMultiplayer;
