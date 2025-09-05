
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GamePage from "./pages/GamePage";
import CreateNewGame from './pages/CreateGame';
import Register from './pages/Register';
import Login from './pages/LogIn';
import StartPage from './pages/startPage';
import PlayGame from './pages/PlayGame';
import SingleMultiPlayer from './pages/SingleMultiPlayer';
import CreateMultiplayerGame from './pages/createMultiPGame';
import AllOpenGames from './pages/allOpenGames';
import MultiPlayerBoard from './pages/multiPlayerBoard';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/getAllGames" element={<GamePage />} />
        <Route path="/createNewGame" element={<CreateNewGame />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/startPage" element={<StartPage />} />
        <Route path="/playGame" element={<PlayGame />} />
        <Route path="/singleMultiP" element={<SingleMultiPlayer />} />
        <Route path="/createMultiplayerGame" element={<CreateMultiplayerGame />} />
        <Route path="/allOpenGames" element={<AllOpenGames />} />
        <Route path="/multiPlayerBoard" element={<MultiPlayerBoard />} />


        <Route path="*" element={<h1>404 - Page Not Found</h1>} />

      </Routes>
    </Router>
  );
}

export default App;
