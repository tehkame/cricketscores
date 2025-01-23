import React, { useEffect, useRef, useState } from 'react';
import { Tabulator, FormatModule } from 'tabulator-tables';
import { useParams } from 'react-router-dom';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

Tabulator.registerModule([FormatModule]);

const apiUrl = 'https://csapi-b6cvdxergbf9h5e7.australiasoutheast-01.azurewebsites.net';

const ManageTeam = () => {
  const { teamId } = useParams();

  const teamTableRef = useRef(null);
  const teamTabulatorRef = useRef(null);
  const poolTableRef = useRef(null);
  const poolTabulatorRef = useRef(null);

  const [pageData, setPageData] = useState(null);

    useEffect(() => {
      fetch(`${apiUrl}/state/manageteam/${teamId}`)
        .then((response) => response.json())
        .then((responseJson) => {
          setPageData(responseJson)
        });
    }, [teamId]);

    useEffect(() => {
      if(!pageData) return;
      const attributeList = pageData.lookups.attributes;
      const { assignedPlayers, playerPool } = pageData.tables;
      const teamTable = new Tabulator(teamTableRef.current, {
        headerVisible: false,
        data: assignedPlayers,
        columns: [
          {
            title: '',
            formatter: (cell) => {
              const button = document.createElement('button');
              button.innerHTML = '🢃';
              button.className = 'btn btn-danger rounded';
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
              return value.split(",").map(num=>attributeList[num].ShortName).join("/");
            }       
          },
          { field: 'BatBowl', width: 70 },          
        ],
      });
      teamTabulatorRef.current = teamTable;

      const poolTable = new Tabulator(poolTableRef.current, {
        headerVisible: false,
        data: playerPool,
        columns: [
          {
            title: '',
            formatter: (cell) => {
              const button = document.createElement('button');
              button.innerHTML = '🢁';
              button.className = 'btn btn-success rounded';
              button.addEventListener('click', () => {
                if (teamTableRef.current) {
                  if(teamTabulatorRef.current.getData().length > 10) return;
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
              return value.split(",").map(num=>attributeList[num].ShortName).join("/");
            }       
          },
          { field: 'BatBowl', width: 70},          
        ],
      });
      poolTabulatorRef.current = poolTable;

      return () => { 
          teamTable.destroy();
          poolTable.destroy();
        };
},[pageData, teamId]);

  return  <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center pt-4">
    {pageData ? 
    (
      <div>
            <input name="myInput" defaultValue={pageData.lookups.teamName} className="w-100"/>
            <div ref={teamTableRef}></div>
            <div><h3>Available Players</h3></div>
            <div ref={poolTableRef}></div>
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

export default ManageTeam;