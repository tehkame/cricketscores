import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function NewGame() {
  const apiUrl = 'https://csapi-b6cvdxergbf9h5e7.australiasoutheast-01.azurewebsites.net';

  const [options, setOptions] = useState([]); // State to store dropdown options
  const [selectedBatting, setSelectedBatting] = useState(""); // State for selected value
  const [selectedBowling, setSelectedBowling] = useState("");
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
  }, []); // Empty dependency array to fetch data only on component mount

  const handleBattingDropdownChange = (event) => {
    setSelectedBatting(event.target.value); // Update state with selected value
  };

  const handleBowlingDropdownChange = (event) => {
    setSelectedBowling(event.target.value); // Update state with selected value
  };

  const startGame = () => {
    console.log("Game start!");
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center pt-4">
    {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div class="spinner-border" role="status">
           
          </div>
        </div>
      ) : (
        <>
          {/* Dropdown */}
          <label htmlFor="battingteam" style={{ marginRight: "10px" }}>
            Batting Team:
          </label>
          <select
            id="battingteam"
            value={selectedBatting}
            onChange={handleBattingDropdownChange}
            style={{ padding: "5px", fontSize: "16px" }}
          >
            <option value="">--Select an option--</option>
            {options.map((option) => (
              <option key={option.Id} value={option.Name}>
                {option.Name}
              </option>
            ))}
          </select>

          <label htmlFor="bowlingteam" style={{ marginRight: "10px" }}>
            Batting Team:
          </label>
          <select
            id="bowlingteam"
            value={selectedBowling}
            onChange={handleBowlingDropdownChange}
            style={{ padding: "5px", fontSize: "16px" }}
          >
            <option value="">--Select an option--</option>
            {options.map((option) => (
              <option key={option.Id} value={option.Name}>
                {option.Name}
              </option>
            ))}
          </select>

          {/* Text box */}
          <div style={{ marginTop: "20px" }}>
            <label htmlFor="textbox" style={{ marginRight: "10px" }}>
              Game Name:
            </label><br/>
            <input
              id="textbox"
              type="text"
              value={selectedBatting&&selectedBowling ? `${selectedBatting} V ${selectedBowling}` : ""}
              readOnly
              style={{ padding: "5px", fontSize: "16px", width: "200px" }}
            />
          </div>
            <br/>
            <br/>
          <button onClick={startGame} class="btn btn-primary mb-3">Start Game</button>
        </>
      )}
  </div>
  );
}

export default NewGame;