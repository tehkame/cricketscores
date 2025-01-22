import React, { useEffect, useRef, useState } from 'react';
import { Tabulator, FormatModule } from 'tabulator-tables';
import { useParams } from 'react-router-dom';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Scoreboard from './Scoreboard'

Tabulator.registerModule([FormatModule]);

const apiUrl = 'https://csapi-b6cvdxergbf9h5e7.australiasoutheast-01.azurewebsites.net';

const Match = () => {
  const { matchId } = useParams();
  const [matchData, setMatchData] = useState(null);

    useEffect(() => {
      fetch(`${apiUrl}/state/match/${matchId}`)
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          setMatchData(responseJson)
        });
    }, []);

     

  return  <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center pt-4">
    {matchData ? 
    
      <Scoreboard 
        matchName={matchData.MatchName}
        pactiveBatsmen={matchData.ActiveBatsmen} 
        pinnings={matchData.Innings} 
        pactiveBowlers={matchData.ActiveBowlers} 
        pteams={matchData.Teams} 
        lookups={matchData.Lookups}
        pevents={matchData.Events}
      />
     :
    (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div class="spinner-border" role="status"/>
      </div>
    )}
        
         </div> 

};

export default Match;