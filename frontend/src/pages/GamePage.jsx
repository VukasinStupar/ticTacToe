import React, { useState, useEffect } from 'react';
import { getAllGames } from '../services/gamePageService';
import '../style/gamePage.css';

const GamePage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAllGames = async () => {
    setLoading(true);
    setError('');


    try {

      const result = await getAllGames();
      setGames(result.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch games');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllGames();
  }, []);

  return (
    <div className="all-games-container">
      <h1>All Games</h1>

      {loading && <p>Loading games...</p>}
      {error && <p className="error">{error}</p>}

      {games.length > 0 && (
        <table className="games-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Type</th>
              <th>Winner</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.id}>
                <td>{game.id}</td>
                <td>{game.userId}</td>
                <td>{game.typeOfPlay}</td>
                <td>{game.whoWin}</td>
                <td>{new Date(game.datetime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {games.length === 0 && !loading && !error && <p>No games found.</p>}
    </div>
  );
};

export default GamePage;