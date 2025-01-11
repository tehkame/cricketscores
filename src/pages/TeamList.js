import React, { useEffect, useRef, navigate } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabulator, EditModule, FormatModule, PopupModule } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

Tabulator.registerModule([EditModule, FormatModule, PopupModule]);

const apiUrl = 'https://csapi-b6cvdxergbf9h5e7.australiasoutheast-01.azurewebsites.net';


const TeamList = () => {
  const navigateTo = useNavigate();
  const tableRef = useRef(null);
  const tabulatorRef = useRef(null);
  useEffect(() => {
    fetch(`${apiUrl}/views/teamlist`)
      .then((response) => response.json())
      .then((tabledata) => {
        const table = new Tabulator(tableRef.current, {
          layout:'fitColumns',
          data: tabledata,
          columns: [
            {
              title: '',
              formatter: (cell) => {
                const button = document.createElement('button');
                button.innerHTML = '✎';
                button.addEventListener('click', () => {
                  const teamId = cell.getRow().getData().id;
                  navigateTo(`/team/${teamId}`);
                });
                return button;
              }
            },
            { title: 'Name', field: 'Name',  editor: 'input', editorParams:{ selectContents:true}, minWidth: 200, widthGrow: 1},
            { title: '🏏', field: 'Bat', width: 20 },
            { title: '◐', field: 'Bowl', width: 20 }
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
      });
    });  

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
            <button onClick={addRecord} class="btn btn-primary mb-3">New Team</button>
            <div ref={tableRef}></div>
          </div>
};

export default TeamList;