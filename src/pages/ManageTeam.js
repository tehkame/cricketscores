import React, { useEffect, useRef, useState } from 'react';
import { Tabulator, FormatModule } from 'tabulator-tables';
import { useParams } from 'react-router-dom';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

Tabulator.registerModule([FormatModule]);

const apiUrl = 'https://csapi-b6cvdxergbf9h5e7.australiasoutheast-01.azurewebsites.net';

const attributeList = [
  ["Opener","Op"],
  ["Spin","Sp"],
  ["Wicket Keeper","WK"],
  ["Pace","Pc"],
  ["Captain","Cp"],
]

const ManageTeam = () => {
  const { teamId } = useParams();
  const teamTableRef = useRef(null);
  const teamTabulatorRef = useRef(null);
  const poolTableRef = useRef(null);
  const poolTabulatorRef = useRef(null);
  const [teamName, setTeamName] = useState("")
  const [assignedPlayers, setAssignedPlayers] = useState("")
  const [playerPool, setPlayerPool] = useState("")

  useEffect(() => {
    fetch(`${apiUrl}/teamdetails/${teamId}`)
      .then((response) => response.json())
      .then((tabledata) => {

        setTeamName(tabledata.teamName);
        setAssignedPlayers(tabledata.assignedPlayers);
        setPlayerPool(tabledata.playerPool);
      });
    }, [teamId]);  

    useEffect(() => {
      const table = new Tabulator(teamTableRef.current, {
        headerVisible: false,
        layout:'fitColumns',
        data: assignedPlayers,
        columns: [
          {
            title: '',
            formatter: (cell) => {
              const button = document.createElement('button');
              button.innerHTML = '🢃';
              button.addEventListener('click', () => {
               const row = cell.getRow();
               const rowData = row.getData();
               poolTabulatorRef.current.addData(rowData,true);
               fetch(`${apiUrl}/assignments/${rowData.AssignmentId}`, {method: 'DELETE'});
               row.delete();
              });
              return button;
            }
          },
          { field: 'Name', minWidth: 300, widthGrow: 1},
          { field: 'Attributes', width: 80, formatter: function(cell, formatterParams, onRendered){
              const value = cell.getValue();
              if (!value) return "+";
              return value.split(",").map(num=>attributeList[parseInt(num)-1][1]).join("/");
            }       
          },
          { field: 'BatBowl', width: 50 },          
        ],
      });
      teamTabulatorRef.current = table;
      return () => table.destroy();
},[assignedPlayers]);

useEffect(() => {
  const table = new Tabulator(poolTableRef.current, {
    headerVisible: false,
    layout:'fitColumns',
    data: playerPool,
    columns: [
      {
        title: '',
        formatter: (cell) => {
          const button = document.createElement('button');
          button.innerHTML = '🢁';
          button.addEventListener('click', () => {
            if (teamTableRef.current) {
              const row = cell.getRow();
              const rowData = cell.getRow().getData();
              teamTabulatorRef.current.addData(rowData).then(function(rows){
                fetch(`${apiUrl}/assignments/players/${rowData.PlayerId}`, {method: 'POST',body: teamId})
                .then((response) => response.text())
                .then(newAssignmentId => {
                  rows[0].update({"AssignmentId":newAssignmentId})
                  row.delete();
                });

              }).catch((error) => console.error('Error adding new record', error));;


            }
          });
          return button;
        }
      },
      { field: 'Name', minWidth: 300, widthGrow: 1},
      { field: 'Attributes', width: 80, formatter: function(cell, formatterParams, onRendered){
          const value = cell.getValue();
          if (!value) return "+";
          return value.split(",").map(num=>attributeList[parseInt(num)-1][1]).join("/");
        }       
      },
      { field: 'BatBowl', width: 50},          
    ],
  });
  poolTabulatorRef.current = table;
  return () => table.destroy();
},[playerPool]);

  return  <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center pt-4">
            <input name="myInput" defaultValue={teamName} />
            <div ref={teamTableRef}></div>
            <div><h2>Available Players</h2></div>
            <div ref={poolTableRef}></div>
          </div>
};

export default ManageTeam;