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
  const [teamName, setTeamName] = useState("")

  useEffect(() => {
    fetch(`${apiUrl}/teams/${teamId}/name`)
    .then((response) => response.text())
    .then((data) => setTeamName(data) )
  }, [teamId]); 

  useEffect(() => {
    fetch(`${apiUrl}/funcs/teamassignments/${teamId}`)
      .then((response) => response.json())
      .then((tabledata) => {
        const table = new Tabulator(teamTableRef.current, {
          headerVisible: false,
          layout:'fitColumns',
          data: tabledata,
          columns: [
            { field: 'Name', minWidth: 300, widthGrow: 1},
            { field: 'Attributes', width: 80, formatter: function(cell, formatterParams, onRendered){
                const value = cell.getValue();
                if (!value) return "+";
                return value.split(",").map(num=>attributeList[parseInt(num)-1][1]).join("/");
              }       
            },
            { field: 'BatBowl', width: 30 },          
          ],
        });
        return () => table.destroy();
      });
    }, [teamId]);  


  return  <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center pt-4">
            <input name="myInput" defaultValue={teamName} />
            <div ref={teamTableRef}></div>
          </div>
};

export default ManageTeam;