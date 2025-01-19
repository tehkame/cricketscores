import React, { useEffect, useRef, useState } from 'react';
import { Tabulator, FormatModule } from 'tabulator-tables';
import { useParams } from 'react-router-dom';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

Tabulator.registerModule([FormatModule]);

const apiUrl = 'https://csapi-b6cvdxergbf9h5e7.australiasoutheast-01.azurewebsites.net';

const getLast = (array) => array.slice(-1)[0];

const Match = () => {
  const { matchId } = useParams();

  const [matchName, setMatchName] = useState(null);
  const [innings, setInnings] = useState(null);
  const [activeBatsmen, setActiveBatsmen] = useState(null);
  const [availableBatsmen1, setAvailableBatsmen1] = useState(null);
  const [availableBatsmen2, setAvailableBatsmen2] = useState(null);
  const [activeBowlers, setActiveBowlers] = useState(null);
  const [teams, setTeams] = useState(null);
  const [activeInnings, setActiveInnings] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [activeSpell, setActiveSpell] = useState(null);
  const [isReady, setIsReady] = useState(null);

  const [selectedBatsman1, setSelectedBatsman1] = useState("");
  const [selectedBatsman2, setSelectedBatsman2] = useState("");

  const handleChangeBatsman1 = (event) => {
    setSelectedBatsman1(event.target.value);
  };

  const handleChangeBatsman2 = (event) => {
    setSelectedBatsman2(event.target.value);
  };

    useEffect(() => {
      fetch(`${apiUrl}/state/match/${matchId}`)
        .then((response) => response.json())
        .then((responseJson) => {
          setMatchName(responseJson.MatchName);
          setInnings(responseJson.Innings);
          setActiveBatsmen(responseJson.ActiveBatsmen);
          setAvailableBatsmen1(responseJson.ActiveBatsmen.filter((b) => !b.Out));
          setAvailableBatsmen2(responseJson.ActiveBatsmen.filter((b) => !b.Out));
          setActiveBowlers(responseJson.ActiveBowlers);
          setTeams(responseJson.Teams);
          const activeInnings = getLast(responseJson.Innings);
          setActiveInnings(activeInnings);
          const activeSession = getLast(activeInnings.Sessions);
          setActiveSession(activeSession);
          const activeSpell = getLast(activeSession.Spells);
          setActiveSpell(activeSpell);
          setIsReady(true);
        });
    }, []);

    useEffect(() => {
      
    }, [selectedBatsman1, selectedBatsman2]);


  return  <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center pt-4">
    {isReady ? 
    (
            
    <div className="mb-3 w-100">

      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex flex-column flex-grow-1">
          <div className="border rounded p-1"><span className="fw-bold d-block w-100">{matchName}</span></div>
          <div className="border rounded p-1"><span className="d-block">{teams[0].Name}</span></div>
          <div className="border rounded p-1"><span className="d-block">{teams[1].Name}</span></div>
        </div>
        <div className="d-flex flex-column flex-shrink-0 mx-2">
          <div className="border rounded p-1"><span className="fw-bold d-block">1st</span></div>
          <div className="border rounded p-1"><span className="d-block">{teams[0].Score1 ?? "0"}</span></div>
          <div className="border rounded p-1"><span className="d-block">{teams[1].Score1 ?? "\u2003"}</span></div>
        </div>
        <div className="d-flex flex-column flex-shrink-0">
          <div className="border rounded p-1"><span className="fw-bold d-block">2nd</span></div>
          <div className="border rounded p-1"><span className="fw-bold d-block">{teams[0].Score2 ?? "\u2003"}</span></div>
          <div className="border rounded p-1"><span className="fw-bold d-block">{teams[1].Score2 ?? "\u2003"}</span></div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex flex-column flex-grow-1">      
          <div className="border rounded p-1"><span className="fw-bold d-block w-100">Batsmen</span></div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center">

          <div className="d-flex flex-column flex-shrink-0">      
            <div className="border rounded p-1"><span className="fw-bold d-block w-100">On:</span></div>
          </div>
          <div className="d-flex flex-column flex-grow-1">      
            <select value={selectedBatsman1} onChange={handleChangeBatsman1}>
              <option value="" disabled>
                Select batsman
            </option>
            {batsman1Options.map((b) => (
              <option key={b.Id} value={b}>
                {b.Name} ({b.DisplayValue})
              </option>
            ))}
        </select>
          </div>
          <div className="d-flex flex-column flex-shrink-0">      
            <div className="border rounded p-1"><span className="fw-bold d-block w-100">Off:</span></div>
          </div>
          <div className="d-flex flex-column flex-grow-1">      
            <select value={selectedBatsman2} onChange={handleChangeBatsman2}>
              <option value="" disabled>
                Select batsman
            </option>
            {batsman2Options.map((b) => (
              <option key={b.Id} value={b}>
                {b.Name} ({b.DisplayValue})
              </option>
            ))}
        </select>
          </div>

      </div>
    </div>
    ) :
    (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div class="spinner-border" role="status"/>
      </div>
    )
        }
          </div>

};

export default Match;