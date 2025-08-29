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

// Generalno je React aplikacija dosta dobra i nisam imao nekih vecih komentara, ostavicu ovde jednu stvar koja vazi za integraciju back i fronta:
// Dobra je praksa i vremeno se pokaze veoma korisno da standardizujes podatke koje backend API vraca u svakom response-u, olaksava provere koje radis na frontu i time pojednostavljuje kod
// Ovo je malo laske sa TS jer zapravo mozes definisati tipove i dobijati proveri i od strane code editora ali mozes se odraditi i u plain js
/*
Nesto poput:
{
  success (moze biti true/false),
  error? (prisutan samo ako je success false): {
    message (user friendly poruka koja objasnjava sta se desilo),
    statusCode (http response code)
  },
  content? (prisutan samo ako je success true): {
    unutar ovog objekta bi vracao data specifican za svaki API endpoit
  }
}
 */
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
      </Routes>
    </Router>
  );
}

export default App;
