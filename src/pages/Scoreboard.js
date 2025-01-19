import React, { useEffect, useRef, useState } from 'react';
import { Tabulator, FormatModule } from 'tabulator-tables';
import { useParams } from 'react-router-dom';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-select/dist/js/bootstrap-select.min.js';

Tabulator.registerModule([FormatModule]);

const apiUrl = 'https://csapi-b6cvdxergbf9h5e7.australiasoutheast-01.azurewebsites.net';

const getLast = (array) => array[array.length-1];

const getDTen = (n) => {
  const baseCodePoint = 0x2460;
  const codePoint = baseCodePoint + (n - 1);
  return String.fromCharCode(codePoint);
}

const getRandomTo = (max) => Math.floor(Math.random() * max) + 1;

const Scoreboard = (
  {
    matchName, 
    pinnings,
    pactiveBatsmen,
    pactiveBowlers,
    pteams,  
    lookups
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
  const [selectedBowler, setSelectedBowler] = useState({Id:""});
  const [selectedField, setSelectedField] = useState({Id:"2"});

  const handleChangeBatsman1 = (event) => {  
    const newId = event.target.value;
    fetch(`${apiUrl}/spells/${activeSpell.Id}/Batter1Id`, {method: 'PUT',body: newId})
            .catch((error) => console.error('Error updating data', error));
    const bts = activeBatsmen.filter((b) => b.Id==newId)[0];
    setSelectedBatsman1(bts);
  };

  const handleChangeBatsman2 = (event) => {
    const newId = event.target.value;
    fetch(`${apiUrl}/spells/${activeSpell.Id}/Batter2Id`, {method: 'PUT',body: newId})
            .catch((error) => console.error('Error updating data', error));
    const bts = activeBatsmen.filter((b) => b.Id==newId)[0];
    setSelectedBatsman2(bts);
  };

  const handleChangeBowler = (event) => {
    const newId = event.target.value;
    fetch(`${apiUrl}/spells/${activeSpell.Id}/BowlerId`, {method: 'PUT',body: newId})
    .catch((error) => console.error('Error updating data', error));
    const bts = activeBowlers.filter((b) => b.Id==newId)[0];
    setSelectedBowler(bts);
  };

  const handleChangeField = (event) => {
    const newId = event.target.value;
    fetch(`${apiUrl}/spells/${activeSpell.Id}/Field`, {method: 'PUT',body: newId})
    .catch((error) => console.error('Error updating data', error));
    const bts = lookups.Fields.filter((b) => b.Id==newId)[0];
    setSelectedField(bts);
  };

  const setInitialData = () => {
    const pactiveSession = getLast(activeInnings.Sessions);
    const pactiveSpell = getLast(pactiveSession.Spells);
    setActiveSession(pactiveSession)
    setActiveSpell(pactiveSpell)
    if(pactiveSpell?.Batter1Id)  setSelectedBatsman1(activeBatsmen.filter((b) => b.Id==pactiveSpell.Batter1Id)[0]);
    if(pactiveSpell?.Batter2Id)  setSelectedBatsman2(activeBatsmen.filter((b) => b.Id==pactiveSpell.Batter2Id)[0]);
    if(pactiveSpell?.BowlerId)  setSelectedBowler(activeBowlers.filter((b) => b.Id==pactiveSpell.BowlerId)[0]);
    if(pactiveSpell?.Field)  setSelectedField(lookups.Fields.filter((b) => b.Id==pactiveSpell.Field)[0]);
    setLoading(false)
  }

  const rollFieldDice = () => {
    const fieldDice = getRandomTo(10);
    const batDice = getRandomTo(10);
    const spell = activeSpell;
    spell.FieldDice = fieldDice;
    spell.BatDice = batDice;
    fetch(`${apiUrl}/spells/${activeSpell.Id}/FieldDice`, {method: 'PUT',body: fieldDice})
    .then(fetch(`${apiUrl}/spells/${activeSpell.Id}/BatDice`, {method: 'PUT',body: batDice}))
    .catch((error) => console.error('Error updating data', error));
    //to do - set Field in spell
    setActiveSpell(spell);
  };

  return ( isLoading ? setInitialData() :
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
              <select  className="form-select selectpicker" value={selectedBatsman1.Id} onChange={handleChangeBatsman1} disabled={activeSpell.FieldDice && activeSpell.BatDice ? true : null}>
                <option value="" disabled >
                Select batsman
              </option>
              {activeBatsmen.filter((b)=>b.Id !== selectedBatsman2.Id).map((b) => (
                <option key={b.Id} value={b.Id}>{b.Name} {b.Attributes} {b.DisplayValue}</option>
              ))}
          </select>
            </div>
            
            <div className="d-flex flex-column flex-shrink-0">      
              <div className="border rounded p-1"><span className="fw-bold d-block w-100">Off:</span></div>
            </div>

            <div className="d-flex flex-column flex-grow-1">      
              <select  className="form-select selectpicker" value={selectedBatsman2.Id} onChange={handleChangeBatsman2} disabled={activeSpell.FieldDice && activeSpell.BatDice ? true : null}>
                <option value="" disabled >
                Select batsman
              </option>
              {activeBatsmen.filter((b)=>b.Id !== selectedBatsman1.Id).map((b) => (
                <option key={b.Id} value={b.Id}>{b.Name} {b.Attributes} {b.DisplayValue}</option>
              ))}
          </select>
            </div>

  
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column flex-grow-1">      
            <div className="border rounded p-1"><span className="fw-bold d-block w-100">Bowler</span></div>
            <select  className="form-select selectpicker" value={selectedBowler.Id} onChange={handleChangeBowler} disabled={activeSpell.FieldDice && activeSpell.BatDice ? true : null}>
                <option value="" disabled >
                Select bowler
              </option>
              {activeBowlers.map((b) => (
                <option key={b.Id} value={b.Id}>{b.Name} {b.Attributes} {b.DisplayValue}</option>
              ))}
          </select>
          </div>

          <div className="d-flex flex-column flex-shrink-0">      
              <div className="border rounded p-1"><span className="fw-bold d-block w-100">Field</span></div>
                <div className="d-flex">
                { activeSpell.FieldDice && activeSpell.BatDice ?  <div className="d-flex">
                    <span className="font-weight-bold d-block border rounded border-danger text-danger m-1 ps-2 pe-2"><b>{activeSpell.FieldDice}</b></span>
                    <span className="font-weight-bold d-block border rounded border-success text-success m-1 ps-2 pe-2"><b>{activeSpell.BatDice}</b></span>
                  </div>
                : <div/> }
                 
                  <span className="d-block">
                    <select  className="form-select selectpicker" value={selectedField.Id} onChange={handleChangeField} disabled={activeSpell.FieldDice && activeSpell.BatDice ? true : null}>
                        {lookups.Fields.map((f) => (
                          <option key={f.Id} value={f.Id}>{f.Name}</option>
                        ))}
                    </select>
                  </span>
                </div>
        </div>

      </div>

      { !activeSpell.FieldDice || !activeSpell.BatDice ?  <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column flex-grow-1">      
          <button type="button" class="btn btn-primary" onClick={rollFieldDice}>Roll Field Dice</button>
          </div>
        </div>
                : <div/> }

      { activeSpell.FieldDice && activeSpell.BatDice ?  <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column flex-grow-1">      
          <button type="button" class="btn btn-primary">Roll Batting Dice</button>
          </div>
        </div>
                : <div/> }

    </div>
    </div>
  )
  

          
};

export default Scoreboard;