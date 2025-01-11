import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NewGame from "./pages/NewGame";
import ManageTeams from "./pages/ManageTeams";
import ManageTeam from "./pages/ManageTeam";
import ManagePlayers from "./pages/ManagePlayers";
import PastGames from "./pages/PastGames";
import Settings from "./pages/Settings";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/new-game" element={<NewGame />} />
          <Route path="/manage-teams" element={<ManageTeams />} />
          <Route path="/manage-players" element={<ManagePlayers />} />
          <Route path="/past-games" element={<PastGames />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/team/:id" element={<ManageTeam />} />
        </Routes>
      </div>
    </Router>
  );
}

function MainMenu() {
  return (
  <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center pt-4">
      <div className="d-flex flex-column w-100" style={{ maxWidth: "400px" }}>
      <Link to="/new-game" className="btn btn-primary mb-3">New Game</Link>
      <Link to="/manage-teams" className="btn btn-primary mb-3">Manage Teams</Link>
      <Link to="/manage-players" className="btn btn-primary mb-3">Manage Players</Link>
      <Link to="/past-games" className="btn btn-primary mb-3">Past Games</Link>
      <Link to="/settings" className="btn btn-primary mb-3">Settings</Link>
      </div>
    </div>
  );
}

export default App;