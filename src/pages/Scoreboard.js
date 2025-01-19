import React, { useEffect, useRef, useState } from 'react';
import { Tabulator, FormatModule } from 'tabulator-tables';
import { useParams } from 'react-router-dom';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-select/dist/js/bootstrap-select.min.js';

Tabulator.registerModule([FormatModule]);

const apiUrl = 'https://csapi-b6cvdxergbf9h5e7.australiasoutheast-01.azurewebsites.net';

const getLast = (array) => array[array.length-1];

const Scoreboard = (
  {
    matchName, 
    pinnings,
    pactiveBatsmen,
    pactiveBowlers,
    pteams,  
  }) => {
  

  const [innings, setInnings] = useState(pinnings);
  const [activeBatsmen, setActiveBatsmen] = useState(pactiveBatsmen);
  const [activeBowlers, setActiveBowlers] = useState(pactiveBowlers);
  const [teams, setTeams] = useState(pteams);
  const [isLoading, setLoading] = useState(true);


  const [activeInnings, setActiveInnings] = useState(pinnings[pinnings.length-1]);
  const [activeSession, setActiveSession] = useState();
  const [activeSpell, setActiveSpell] = useState();

  const [selectedBatsman1, setSelectedBatsman1] = useState({Id:""});
  const [selectedBatsman2, setSelectedBatsman2] = useState({Id:""});

  const handleChangeBatsman1 = (event) => {  
    const bts = activeBatsmen.filter((b) => b.Id==event.target.value)[0];
    setSelectedBatsman1(bts);
  };

  const handleChangeBatsman2 = (event) => {
    const bts = activeBatsmen.filter((b) => b.Id==event.target.value)[0];
    setSelectedBatsman2(bts);
  };

  const setInitialData = () => {
    const pactiveSession = getLast(activeInnings.Sessions);
    const pactiveSpell = getLast(pactiveSession.Spells);
    setActiveSession(pactiveSession)
    setActiveSpell(pactiveSpell)
    setLoading(false)
  }

  return ( isLoading ? setInitialData() : 
    <div> {console.log("I")}
    <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center pt-4">       
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
              <select  className="form-select selectpicker" value={selectedBatsman1.Id} onChange={handleChangeBatsman1}>
                <option value="" disabled >
                Select batsman
              </option>
              {activeBatsmen.filter((b)=>b.Id !== selectedBatsman2.Id).map((b) => (
                <option>
                <div class="d-flex justify-content-between">
                  <div className="d-flex flex-column flex-grow-1"><span>Left</span></div>
                  <div className="d-flex flex-column flex-shrink-0"><span>Right</span></div>
                </div>
              </option>
              ))}
          </select>
            </div>
            
            <div className="d-flex flex-column flex-shrink-0">      
              <div className="border rounded p-1"><span className="fw-bold d-block w-100">Off:</span></div>
            </div>

            <div className="d-flex flex-column flex-grow-1">      
              <select value ={selectedBatsman2.Id} onChange={handleChangeBatsman2}>
                <option value="" disabled >
                Select batsman
              </option>
              {activeBatsmen.filter((b)=>b.Id !== selectedBatsman1.Id).map((b) => (
                <option key={b.Id} value={b.Id}><div className="d-flex justify-content-between align-items-center"><div className="d-flex flex-column flex-grow-1">{b.Name}</div><div className="d-flex flex-column flex-shrink-0">({b.DisplayValue})</div></div></option>
              ))}
          </select>
            </div>

  
        </div>
      </div>
    </div>
    </div>
  )
  

          
};

export default Scoreboard;