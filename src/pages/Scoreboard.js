import React, { useEffect, useRef, useState } from 'react';
import { Tabulator, FormatModule, FilterModule } from 'tabulator-tables';
import { apiUrl } from "./utils/constants";
import { getD6, getRandomTo, getById, handleChangeById } from "./utils/utils";
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-select/dist/js/bootstrap-select.min.js';
Tabulator.registerModule([FormatModule, FilterModule]);


const Scoreboard = (
  {
    matchName, 
    pactiveBatsmen,
    pactiveBowlers,
    pteams,  
    lookups,
    pevents
  }) => {
  
  const nullPlayer = {Id : ""};

  const [activeBatsmen, setActiveBatsmen] = useState(pactiveBatsmen);
  const [activeBowlers, setActiveBowlers] = useState(pactiveBowlers);
  const [teams, setTeams] = useState(pteams);
  const [currentEvent, setCurrentEvent] = useState(pevents[0]);
  const [batQuantity, setBatQuantity] = useState(3);
  const [selectedBatsman1, setSelectedBatsman1] = useState(pevents[0].Batter1Id ? getById(pactiveBatsmen, pevents[0].Batter1Id) : nullPlayer);
  const [selectedBatsman2, setSelectedBatsman2] = useState(pevents[0].Batter2Id ? getById(pactiveBatsmen, pevents[0].Batter2Id) : nullPlayer);
  const [selectedBowler, setSelectedBowler] = useState(nullPlayer);
  const [selectedField, setSelectedField] = useState({Id:"2"});
  
  const tableRef = useRef(null);
  const tabulatorRef = useRef(null);

useEffect(() => {
        const table = new Tabulator(tableRef.current, {
          data: pevents,
          initialFilter: [{field:'actions', type:"!=", value: null}],
          layout:"fitDataStretch",
          columns: [
            { title: 'Match Spells', field: 'Description'},   
            { title: 'Runs', field: 'Runs', width: 70},  
            { title: 'Out', field: 'Out', width: 80},  
            { title: 'Dice', field: 'actions', formatter: function(cell, formatterParams, onRendered){
              const value = cell.getValue();
              if (!value) return "";
              const actionsarr = JSON.parse(value);         
              return `<div class="d-flex flex-column">${actionsarr.map((actions) => `<div class="d-flex flex-row mb-1"><div class="bg-danger rounded d-inline-block" style="width: 20px; margin-right:1px;"><span class="d-block fw-bold text-white text-center" style="margin-right: 1px;">${actions.FieldDice}</span></div><div class="bg-success rounded d-inline-block" style="width: 20px;"><span class="d-block fw-bold text-white text-center">${actions.BatDice}</span></div><div class="d-inline-block">${actions.Dice.toString().split('').map((d) => getD6(parseInt(d))).join('')}</div></div>`).join('')}</div>`
            }}
          ],
        });
        tabulatorRef.current = table;
        return () => table.destroy();
    }, [pevents]);

    const rollSpell = () => {
      rollSpellAsync().then((events) => 
        {
          const teamsData = teams;
          const activeTeamIndex  = teamsData.findIndex((t) => t.IsBatting);
          const propName = [1,3].includes(events[0].InningsIndex) ? "Innings1Score" : "Innings2Score";
          console.log(teamsData[activeTeamIndex]);
          console.log(events);
          teamsData[activeTeamIndex][propName] += events[1].Runs;
          console.log(teamsData[activeTeamIndex]);
          setTeams(teamsData);
          tabulatorRef.current.addData(events, true);
          setCurrentEvent(events[0])
          setSelectedBatsman1(getById(pactiveBatsmen, events[0].Batter1Id))
          setSelectedBatsman2(getById(pactiveBatsmen, events[0].Batter2Id) ?? nullPlayer)
          setActiveBatsmen(activeBatsmen);
          setActiveBowlers(activeBowlers);
          setTeams(teams);
          setSelectedBowler(nullPlayer)
        })
    }
  const rollSpellAsync = async () => {
    await fetch(`${apiUrl}/multi/spells/${currentEvent.SpellId}`, {method: 'PUT',body: `BowlerId=${selectedBowler.Id},Batter1Id=${selectedBatsman1.Id},Batter2Id=${selectedBatsman2.Id}, Field=${selectedField.Id}`});
    const fieldDice = getRandomTo(10);
    const batDice = getRandomTo(10);
    const difference = fieldDice-batDice;
    if(difference>1 || difference<-1)
    {
      const bts = lookups.Fields.filter((b) => b.Name==="Normal")[0];
      setSelectedField(bts);
    }    
    var actionResult = await rollBattingDice(fieldDice, batDice);
    if(selectedField.Id===3 && !actionResult.Out) 
    {
      actionResult = await rollBattingDice(getRandomTo(10), getRandomTo(10));
    }
    const newSpell = {
      Batter1Id: selectedBatsman2.Id,
      Batter2Id: actionResult.Out ? null : selectedBatsman1.Id,
    };
    const newSpellResponse = await fetch(`${apiUrl}/newspell/${currentEvent.SessionId}`, {method: 'POST',body: JSON.stringify(newSpell)});
    const newSpellData = await newSpellResponse.json();
    return [actionResult,newSpellData]
  }


  const rollBattingDice = async (fieldDice, batDice) => {
    const diceResults = Array.from({ length: batQuantity }, (_, i) => getRandomTo(6));
    const runs = determineRuns(diceResults);
    const out = determineOut(fieldDice, batDice);
    const insertAction = {
      FieldDice: fieldDice,
      BatDice: batDice,
      Dice: parseInt(diceResults.join('')),
      Runs: runs,
      Out: out ||  null
    }
    const newActionResponse = await fetch(`${apiUrl}/newaction/${currentEvent.SpellId}`, {method: 'POST',body: JSON.stringify(insertAction)});
    const newAction = await newActionResponse.json();
    newAction.Out = out ? lookups.Outs[out-1].Label : null;
    return await newAction;
  }

  const determineOut = (fieldDice, batDice) => 
  {
    const modifiedBowlerRating = determineBowlerModifiedRating();
    const isAppeal = fieldDice > modifiedBowlerRating;
    if (isAppeal)
    {
      const isOut = batDice > selectedBatsman1.Bat;
      if (isOut) 
      { 
        return getRandomTo(10);
      }  
    }
  }

  const determineBowlerModifiedRating = () => {
    const baseRating=selectedBowler.Bowl;
    if (selectedBatsman1.DisplayValue.includes("x") || batQuantity===3) return baseRating;
    if  (batQuantity===2) return baseRating+1;
    return baseRating-(batQuantity-3)*2;
  }

  const determineRuns = (diceResults) => {
    diceResults = diceResults.filter((d)=>d!==2);
    if (selectedField.Id===1)  diceResults.filter((d)=>d!==3);
    return diceResults.reduce((t, d) => t + d, 0);
  }



  return (
    <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center pt-4">       
      <div className="mb-3 w-100">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column flex-grow-1">
            <div className="border rounded p-1"><span className="d-block fw-bold w-100">{matchName}</span></div>
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
              <select  className="form-select selectpicker" value={selectedBatsman1.Id} onChange={(event) => handleChangeById(event, activeBatsmen, setSelectedBatsman1)} disabled={currentEvent?.Batter1Id}>
                <option value="" disabled >Select batsman</option>
                {activeBatsmen.filter((b)=>b.Id !== selectedBatsman2?.Id && !b.Out).map((b) => (<option key={b.Id} value={b.Id}>{b.Name} {b.Attributes} {b.DisplayValue}</option>))}
              </select>              
            </div>
            
            <div className="d-flex flex-column flex-shrink-0">      
              <div className="border rounded p-1"><span className="fw-bold d-block w-100">Off:</span></div>
            </div>

            <div className="d-flex flex-column flex-grow-1">  
              <select  className="form-select selectpicker" value={selectedBatsman2.Id} onChange={(event) => handleChangeById(event, activeBatsmen, setSelectedBatsman2)} disabled={currentEvent?.Batter2Id}>
                <option value="" disabled >Select batsman</option>
                {activeBatsmen.filter((b)=>b.Id !== selectedBatsman1?.Id && !b.Out).map((b) => (<option key={b.Id} value={b.Id}>{b.Name} {b.Attributes} {b.DisplayValue}</option>))}
              </select>
            </div>
 
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column flex-grow-1">      
            <div className="border rounded p-1"><span className="fw-bold d-block w-100">Bowler</span></div>
            <select  className="form-select selectpicker" value={selectedBowler.Id} onChange={(event) => handleChangeById(event, activeBowlers, setSelectedBowler)}>
              <option value="" disabled >Select bowler</option>
              {activeBowlers.map((b) => (<option key={b.Id} value={b.Id}>{b.Name} {b.Attributes} {b.DisplayValue}</option>))}
            </select>
          </div>

          <div className="d-flex flex-column flex-shrink-0">      
              <div className="border rounded p-1"><span className="fw-bold d-block w-100">Field</span></div>
                <div className="d-flex">               
                  <span className="d-block">
                    <select  className="form-select selectpicker" value={selectedField.Id} onChange={(event) => handleChangeById(event, lookups.Fields, setSelectedField)}>
                        {lookups.Fields.map((f) => (<option key={f.Id} value={f.Id}>{f.Name}</option>))}
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

      <div className="d-flex justify-content-between align-items-center">
      <div className="d-flex flex-column flex-grow-1"> 
        <div ref={tableRef}></div>
        </div>
      </div>

    </div>
    </div>
  )
  

          
};

export default Scoreboard;