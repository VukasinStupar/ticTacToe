// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import GamePage from "./pages/GamePage";
// import CreateNewGame from './pages/CreateGame';
// import Register from './pages/Register';
// import Login from './pages/LogIn';
// import StartPage from './pages/startPage';
// import PlayGame from './pages/PlayGame';
// import JoinGameList from './pages/joinGameList';
// import MultiPlayerStartBoard from './pages/multiPlayerStartBoard';

// function App() {
//   return (
//     <Router>
//       <Routes>
        
//         <Route path="/getAllGames" element={<GamePage />} />
//         <Route path="/createNewGame" element={<CreateNewGame />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/startPage" element={<StartPage />} />
//         <Route path="/playGame" element={<PlayGame />} />
//         <Route path="/joinGameList" element={<JoinGameList />} />
//         <Route path="/multiPlayerStartBoard" element={<MultiPlayerStartBoard />} />

        

//         <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        

//       </Routes>
//     </Router>


//   );

  
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GamePage from "./pages/GamePage";
import CreateNewGame from './pages/CreateGame';
import Register from './pages/Register';
import Login from './pages/LogIn';
import StartPage from './pages/startPage';
import PlayGame from './pages/PlayGame';
import JoinGameList from './pages/joinGameList';
import PlayGameMultiplayer from './pages/PlayGameMultiplayer';
import TestSocket from './pages/TestSocket';

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
        <Route path="/joinGameList" element={<JoinGameList />} />
        <Route path="/multiPlayerStartBoard" element={<PlayGameMultiplayer gameId={localStorage.getItem("joinGameId")} />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />

        <Route path="/testSocket" element={<TestSocket/>} />

      </Routes>
    </Router>
  );
}

export default App;
