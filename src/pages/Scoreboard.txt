import React, { useEffect, useRef, useState } from 'react';
import { Tabulator, FormatModule } from 'tabulator-tables';
import { useParams } from 'react-router-dom';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-select/dist/js/bootstrap-select.min.js';
import d1 from './img/1.png';
import d2 from './img/1.png';
import d3 from './img/1.png';
import d4 from './img/1.png';
import d5 from './img/1.png';
import d6 from './img/1.png';

Tabulator.registerModule([FormatModule]);

const apiUrl = 'https://csapi-b6cvdxergbf9h5e7.australiasoutheast-01.azurewebsites.net';

const dice = [
  "iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAABPSURBVDhPY/wPBIyMjAzkAKBWBpBOkBkQERIByGImKJtsMGoAAQNAoUwoinEagKwRnyG08wJy4sKX0PC6AKSRUCqlnReIBcPAAAoLlP8MAA20Hhndux77AAAAAElFTkSuQmCC",
  "iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAABhSURBVDhPvZTBCgAgCEO1///nctShEEUt2imCvZqNuIuYmSoSK8EJxtxJCge3tS5LAUDNRDoAuzEKeRthH2Z0sOoGMGZe5W2Eiv4BrH6EAF4//kTw+hG+gdWP6wiXH0qnAXITKhmVbjO7AAAAAElFTkSuQmCC",
  "iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAABxSURBVDhPtZRRCsAwCEN1979zV+kYNmiJa/e+ZJAsvI9q66iqfKFHxZLWMb4UsR9fz01hAVxLF/igv0sLIugC78nfpQUWROHLgkgakhZk0pD/JGbSkOWCSBoyFTDSkLeAlYack8hKQ6YFjDRk80FpcgPWcjYZiIyhFAAAAABJRU5ErkJggg==",
  "iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAABqSURBVDhPzZRBDsAgCASh//+zZWIPaGuClkTnRDawghi1GKoqK1ipUIlHVSbh4OuJl3kZ4Po10khvDHxCJIbcEfxlRmKgH9NO2sIs+QbM1a8KRnpj4BMiMeSOENl9v3L6MW3jO/j5oRS5AbyeMi0FWcwdAAAAAElFTkSuQmCC",
  "iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAB+SURBVDhPrZRBDoAgDASp//8zdtE0penSiMxJWFnqHJSuiEjbQY82nETHs/MRXHy9zwNsrKbJcivwQVbC8mmCHazAe8icsByz6PqQxAheyHx4aAGTFjknMcKkRZYT4GAleCqopGW5FfggK2H5OYmVNJZjFl2vRTHwKT9/KL3dIQw+LZe0CRwAAAAASUVORK5CYII=",
  "iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAABxSURBVDhPrYwBCsAgDAP7/093c7usTAOKeBCwR0zkTURshb/vYweG/gNIrsJ5XEmVFDHxBwcafUk4jxvLq9gBJFfhPK6kSoqY+IMDjb4knMeN5VXsAJKrcB5XUiVFTPzBgUZfEs7jxvIqz8D32Ehm5gV4jPEroqb9EQAAAABJRU5ErkJggg=="
];

const getLast = (array) => array[array.length-1];

const getDSix = (n) => `&#98${55+parseInt(n)}`;

const getD6 = (n) => 
  {
    return `<img src="data:image/png;base64,${dice[n-1]}" style="margin-left: 1px; margin-bottom: 4px;"/>`
  };

const getRandomTo = (max) => Math.floor(Math.random() * max) + 1;

const Scoreboard = (
  {
    matchName, 
    pinnings,
    pactiveBatsmen,
    pactiveBowlers,
    pteams,  
    lookups,
    pevents
  }) => {
  

  const [innings, setInnings] = useState(pinnings);
  const [activeBatsmen, setActiveBatsmen] = useState(pactiveBatsmen);
  const [activeBowlers, setActiveBowlers] = useState(pactiveBowlers);
  const [teams, setTeams] = useState(pteams);
  const [events, setEvents] = useState(pevents);
  const [isLoading, setLoading] = useState(true);
  const [batQuantity, setBatQuantity] = useState(3);


  const [activeInnings, setActiveInnings] = useState(pinnings[pinnings.length-1]);
  const [activeSession, setActiveSession] = useState();
  const [activeSpell, setActiveSpell] = useState();

  const [selectedBatsman1, setSelectedBatsman1] = useState({Id:""});
  const [selectedBatsman2, setSelectedBatsman2] = useState({Id:""});
  const [committedBatsman1, setCommittedBatsman1] = useState({Id:""});
  const [committedBatsman2, setCommittedBatsman2] = useState({Id:""});
  const [selectedBowler, setSelectedBowler] = useState({Id:""});
  const [selectedField, setSelectedField] = useState({Id:"2"});

  const tableRef = useRef(null);
  const tabulatorRef = useRef(null);

useEffect(() => {
        const table = new Tabulator(tableRef.current, {
          data: pevents,
          layout:"fitDataStretch",
          columns: [

            { title: 'Match Spells', field: 'Description', minWidth: 200, widthGrow: 1},   
            { title: '', field: 'Runs'},  
            { title: '', field: 'Out'},  
            { title: '', field: 'actions', minWidth: 100,  minWidth: 50, widthGrow: 1, formatter: function(cell, formatterParams, onRendered){
              const value = cell.getValue();
              if (!value) return "";
              console.log(value);
              const actionsarr = JSON.parse(value);         
              return `<div class="d-flex flex-column">${actionsarr.map((actions) => `<div class="d-flex flex-row mb-1"><div class="bg-danger rounded d-inline-block" style="width: 20px; margin-right:1px;"><span class="d-block fw-bold text-white text-center" style="margin-right: 1px;">${actions.FieldDice}</span></div><div class="bg-success rounded d-inline-block" style="width: 20px;"><span class="d-block fw-bold text-white text-center">${actions.BatDice}</span></div><div class="d-inline-block">${actions.Dice.toString().split('').map((d) => getD6(parseInt(d))).join('')}</div></div>`).join('')}</div>`
            }}
          ],
        });
        tabulatorRef.current = table;
        return () => table.destroy();
    }, []);

  const handleChangeBatsman1 = (event) => {  
    const newId = event.target.value;
    const bts = activeBatsmen.filter((b) => b.Id==newId)[0];
    setSelectedBatsman1(bts);
  };

  const handleChangeBatsman2 = (event) => {
    const newId = event.target.value;
    const bts = activeBatsmen.filter((b) => b.Id==newId)[0];
    setSelectedBatsman2(bts);
  };

  const handleChangeBowler = (event) => {
    const newId = event.target.value;
    const bts = activeBowlers.filter((b) => b.Id==newId)[0];
    setSelectedBowler(bts);
  };

  const handleBatQuantityChange = (event) => {
    console.log(event.target.value);
  };

  const handleChangeField = (event) => {
    const newId = event.target.value;
    const bts = lookups.Fields.filter((b) => b.Id==newId)[0];
    console.log(bts);
    setSelectedField(bts);
  };

  const setInitialData = () => {
    const pactiveSession = getLast(activeInnings.Sessions);
    const pactiveSpell = getLast(pactiveSession.Spells);
    setActiveSession(pactiveSession)
    setActiveSpell(pactiveSpell)
    if(pactiveSpell?.Batter1Id)  
    {
      const setb1 = activeBatsmen.filter((b) => b.Id==pactiveSpell.Batter1Id)[0];
      setSelectedBatsman1(setb1);
      setCommittedBatsman1(setb1);
    }
    if(pactiveSpell?.Batter2Id)
    {
      const setb2 = activeBatsmen.filter((b) => b.Id==pactiveSpell.Batter2Id)[0];
        setSelectedBatsman2(setb2);
        setCommittedBatsman2(setb2)
    }
    if(pactiveSpell?.BowlerId)  setSelectedBowler(activeBowlers.filter((b) => b.Id==pactiveSpell.BowlerId)[0]);
    setLoading(false)
  }

  const rollSpell = () => {
    fetch(`${apiUrl}/multi/spells/${activeSpell.Id}`, {method: 'PUT',body: `BowlerId=${selectedBowler.Id},Batter1Id=${selectedBatsman1.Id},Batter2Id=${selectedBatsman2.Id}, Field=${selectedField.Id}`});
    const fieldDice = getRandomTo(10);
    const batDice = getRandomTo(10);
    const difference = fieldDice-batDice;
    console.log(`Selected Field:${selectedField.Name} ${selectedField.Id}`);
    if(difference>1 || difference<-1)
    {
      console.log("Setting field to normal");
      const bts = lookups.Fields.filter((b) => b.Name=="Normal")[0];
      setSelectedField(bts);
    }    
    setCommittedBatsman1(selectedBatsman1)
    setCommittedBatsman2(selectedBatsman2);
    var out = rollBattingDice(fieldDice, batDice);
    if(selectedField.Id==3 && !out) 
    {
      console.log("second roll!")
      out = rollBattingDice(getRandomTo(10), getRandomTo(10));
    }
    const newSpell = {
      Batter1Id: selectedBatsman2.Id,
      Batter2Id: out ? null : selectedBatsman1.Id,
    };
    fetch(`${apiUrl}/newspell/${activeSession.Id}`, {method: 'POST',body: JSON.stringify(newSpell)})
  }


  const rollBattingDice = (fieldDice, batDice) => {
    console.log(`Field:${fieldDice} Bat:${batDice}`);
    const diceResults = Array.from({ length: batQuantity }, (_, i) => getRandomTo(6));
    console.log(diceResults);
    const runs = determineRuns(diceResults);
    console.log(`Runs: ${runs}`);
    const out = determineOut(fieldDice, batDice);
    const newAction = {
      FieldDice: fieldDice,
      BatDice: batDice,
      Dice: parseInt(diceResults.join('')),
      Runs: runs,
      Out: out ||  null
    }
    fetch(`${apiUrl}/newaction/${activeSpell.Id}`, {method: 'POST',body: JSON.stringify(newAction)})
    return out;
  }

  const determineOut = (fieldDice, batDice) => 
  {
    const modifiedBowlerRating = determineBowlerModifiedRating();
    const isAppeal = fieldDice > modifiedBowlerRating;
    console.log(`Modified Bowler rating: ${modifiedBowlerRating}`);
    if (isAppeal)
    {
      console.log(`Appeal! (${fieldDice} > ${modifiedBowlerRating})`);
      const isOut = batDice > selectedBatsman1.Bat;
      if (isOut) 
      { 
        console.log(`Out! (${batDice} > ${selectedBatsman1.Bat})`);
        return getRandomTo(10);
      }  
    }
  }

  const determineBowlerModifiedRating = () => {
    const baseRating=selectedBowler.Bowl;
    if (selectedBatsman1.DisplayValue.includes("x") || batQuantity==3) return baseRating;
    if  (batQuantity==2) return baseRating+1;
    if  (batQuantity==4) return baseRating-2;
    if  (batQuantity==5) return baseRating-4;
    if  (batQuantity==6) return baseRating-6;
  }

  const determineRuns = (diceResults) => {
    diceResults = diceResults.filter((d)=>d!=2);
    if (selectedField.Id==1)  diceResults.filter((d)=>d!=3);
    return diceResults.reduce((t, d) => t + d, 0);
  }


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
            <div className="border rounded p-1"><span className="d-block">{teams[0].Innings1Score ?? "0"}</span></div>
            <div className="border rounded p-1"><span className="d-block">{teams[1].Innings1Score ?? "\u2003"}</span></div>
          </div>
          <div className="d-flex flex-column flex-shrink-0">
            <div className="border rounded p-1"><span className="fw-bold d-block">2nd</span></div>
            <div className="border rounded p-1"><span className="fw-bold d-block">{teams[0].Innings2Score ?? "\u2003"}</span></div>
            <div className="border rounded p-1"><span className="fw-bold d-block">{teams[1].Innings2Score ?? "\u2003"}</span></div>
          </div>
        </div>
  
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column flex-grow-1">      
            <div className="border rounded p-1">
            <div class="d-flex justify-content-between">
              <span className="fw-bold d-block w-100 text-start">Batsmen</span>
              <span className="d-block w-100 text-end">{lookups.BatLevels[batQuantity-2].Name}</span>
              </div>
              </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
        <input type="range" class="form-range" id="customRange1" min="2" max="6" step="1" value={batQuantity} onChange={e => setBatQuantity(e.target.value)}/>
        </div>       
  
        <div className="d-flex justify-content-between align-items-center">
  
            <div className="d-flex flex-column flex-shrink-0">      
              <div className="border rounded p-1"><span className="fw-bold d-block w-100">On:</span></div>
            </div>

            <div className="d-flex flex-column flex-grow-1">    
              <select  className="form-select selectpicker" value={selectedBatsman1.Id} onChange={handleChangeBatsman1} disabled={committedBatsman1?.Id ? true : null}>
                <option value="" disabled >
                Select batsman
              </option>
              {activeBatsmen.filter((b)=>b.Id !== selectedBatsman2.Id && !b.Out).map((b) => (
                <option key={b.Id} value={b.Id}>{b.Name} {b.Attributes} {b.DisplayValue}</option>
              ))}
          </select> 
              
            </div>
            
            <div className="d-flex flex-column flex-shrink-0">      
              <div className="border rounded p-1"><span className="fw-bold d-block w-100">Off:</span></div>
            </div>

            <div className="d-flex flex-column flex-grow-1">  
              <select  className="form-select selectpicker" value={selectedBatsman2.Id} onChange={handleChangeBatsman2} disabled={committedBatsman2?.Id ? true : null}>
                <option value="" disabled >
                Select batsman
              </option>
              {activeBatsmen.filter((b)=>b.Id !== selectedBatsman1.Id && !b.Out).map((b) => (
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
                 
                  <span className="d-block">
                    <select  className="form-select selectpicker" value={selectedField.Id} onChange={handleChangeField}>
                        {lookups.Fields.map((f) => (
                          <option key={f.Id} value={f.Id}>{f.Name}</option>
                        ))}
                    </select>
                  </span>
                </div>
        </div>

      </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column flex-grow-1">      
          <button type="button" class="btn btn-primary" onClick={rollSpell} disabled={!selectedBatsman1?.Id || !selectedBatsman2?.Id || !selectedBowler?.Id}>Roll Spell</button>
          </div>
        </div>

      <div>
        <div ref={tableRef}></div>
      </div>

    </div>
    </div>
  )
  

          
};

export default Scoreboard;