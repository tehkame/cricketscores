import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function NewGame() {

  const navigate = useNavigate();

  const apiUrl = 'https://csapi-b6cvdxergbf9h5e7.australiasoutheast-01.azurewebsites.net';

  const [options, setOptions] = useState([]); // State to store dropdown options
  const [selectedBatting, setSelectedBatting] = useState({Id:""}); // State for selected value
  const [selectedBowling, setSelectedBowling] = useState({Id:""});
  const [gameName, setGameName] = useState("");
  const [loading, setLoading] = useState(true); // State for loading status

  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await fetch(`${apiUrl}/views/teamlist`);
        if (!response.ok) {
          throw new Error("Failed to fetch options");
        }
        const data = await response.json();
        setOptions(data); // Assume API returns an array of options
        setLoading(false);
      } catch (error) {
        console.error("Error fetching options:", error);
        setLoading(false);
      }
    }

    fetchOptions();
  }, []);

  const handleBattingDropdownChange = (event) => {
    const newId = event.target.value;
    const bts = options.filter((b) => b.Id==newId)[0];
    setSelectedBatting(bts);
    if(bts.Name && selectedBowling.Name) 
      setGameName(`${bts.Name} V ${selectedBowling.Name}`);
  };

  const handleBowlingDropdownChange = (event) => {
    const newId = event.target.value;
    const bts = options.filter((b) => b.Id==newId)[0];
    setSelectedBowling(bts);
    if(selectedBatting.Name && bts.Name) 
      setGameName(`${selectedBatting.Name} V ${bts.Name}`);
  };

  const handleGamenameChange = (event) => {
    setGameName(event.target.value); 
    console.log(`Set game name to: ${gameName}`);
  };

  const startGame = () => {
    setLoading(true);
    fetch(`${apiUrl}/newgame/${selectedBatting.Id}/${selectedBowling.Id}`, {method: 'POST',body: gameName})
        .then((response) => response.text())
        .then((newMatchId) => navigate(`/match/${newMatchId}`))
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center pt-4">
    {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div class="spinner-border" role="status"/>
        </div>
      ) : (
        <>
          {/* Dropdown */}
          <label htmlFor="battingteam" style={{ marginRight: "10px" }}>
            Batting Team:
          </label>
          <select
            id="battingteam"
            value={selectedBatting.Id}
            onChange={handleBattingDropdownChange}
            style={{ padding: "5px", fontSize: "16px" }}
          >
            <option value="" disabled>--Select an option--</option>
            {options.map((option) => (
              <option key={option.Id} value={option.Id}>
                {option.Name}
              </option>
            ))}
          </select>

          <label htmlFor="bowlingteam" style={{ marginRight: "10px" }}>
            Batting Team:
          </label>
          <select
            id="bowlingteam"
            value={selectedBowling.Id}
            onChange={handleBowlingDropdownChange}
            style={{ padding: "5px", fontSize: "16px" }}
          >
            <option value="" disabled>--Select an option--</option>
            {options.map((option) => (
              <option key={option.Id} value={option.Id}>
                {option.Name}
              </option>
            ))}
          </select>

          <div style={{ marginTop: "20px" }}>
            <label htmlFor="textbox" style={{ marginRight: "10px" }}>
              Game Name:
            </label><br/>
            <input
              id="textbox"
              type="text"
              
              value={gameName}
              style={{ padding: "5px", fontSize: "16px", width: "200px" }}
              onChange={handleGamenameChange}
            />
          </div>
            <br/>
            <br/>
          <button onClick={startGame} class="btn btn-primary mb-3" disabled={!selectedBatting.Id || !selectedBowling.Id || !gameName}>Start Game</button>
        </>
      )}
  </div>
  );
}

export default NewGame;