import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabulator, EditModule, FormatModule, PopupModule } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

Tabulator.registerModule([EditModule, FormatModule, PopupModule]);

const apiUrl = 'https://csapi-b6cvdxergbf9h5e7.australiasoutheast-01.azurewebsites.net';


const TeamList = () => {

  const tableRef = useRef(null);
  const tabulatorRef = useRef(null);

  const [tableData, setTableData] = useState(null);

    useEffect(() => {
      fetch(`${apiUrl}/views/teamlist`)
        .then((response) => response.json())
        .then((responseJson) => {
          setTableData(responseJson)
        });
    }, []);

  useEffect(() => {
        if(!tableData) return;
        const table = new Tabulator(tableRef.current, {
          data: tableData,
          columns: [
            {
              title: '',
              formatter: (cell) => {
                const button = document.createElement('button');
                button.innerHTML = '✎';
                button.addEventListener('click', () => {
                  const teamId = cell.getRow().getData().Id;
                  useNavigate(`/team/${teamId}`);
                });
                return button;
              }
            },
            { title: 'Name', field: 'Name',  editor: 'input', editorParams:{ selectContents:true}, minWidth: 200, widthGrow: 1},
            { title: '🏏', field: 'Bat', width: 60 },
            { title: '◐', field: 'Bowl', width: 60 }
          ],
        });
        table.on("cellEdited", function(cell){
          const fieldName = cell.getField();
          const isNumeric = cell.getColumn().getDefinition().editor === 'number';
          var value = cell.getValue();
          if (!isNumeric) value = `'${value}'`;
          fetch(`${apiUrl}/teams/${cell.getData().Id}/${fieldName}`, {method: 'PUT',body: value})
            .catch((error) => console.error('Error updating data', error));
        });
        tabulatorRef.current = table;
        return () => table.destroy();      
    }, [tableData]);  

    const addRecord = () => {
      if (tabulatorRef.current) {
        tabulatorRef.current.addData([{Name: 'New Team 1',Bat: 0, Bowl: 0}], true).then(function(rows){
          fetch(`${apiUrl}/new/teams`)
          .then((response) => response.text())
          .then(data => rows[0].update({"Id":data}))
          .catch((error) => console.error('Error adding new record', error));
      });
      }
    };

  return  <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center pt-4">
            {tableData ? ( <div>
            <button onClick={addRecord} class="btn btn-primary mb-3">New Team</button>
            <div ref={tableRef}></div>
            </div>) :
            (<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div class="spinner-border" role="status"/>
            </div>)}
          </div>
};

export default TeamList;