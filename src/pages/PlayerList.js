import React, { useEffect, useRef } from 'react';
import { Tabulator, EditModule } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';

Tabulator.registerModule([EditModule]);

const apiUrl = 'https://csapi-b6cvdxergbf9h5e7.australiasoutheast-01.azurewebsites.net';

const PlayerList = () => {
  const tableRef = useRef(null);

  useEffect(() => {
    fetch(`${apiUrl}/playerlist`)
      .then((response) => response.json())
      .then((tabledata) => {
        const table = new Tabulator(tableRef.current, {
          layout:'fitData',
          data: tabledata,
          columns: [
            { title: 'Name', 
              field: 'Name', 
              editor: 'input',
              editorParams:{ selectContents:true}
            },
            { 
              title: 'Attributes', 
              field: 'Attributes' 
            },
            { 
              title: '🏏', 
              field: 'Bat' ,
              editor: 'number', 
              editorParams:{ selectContents:true}
            },
            { 
              title: '◐', 
              field: 'Bowl',
              editor:'number', 
              editorParams:{selectContents:true}
            },
          ],
        });
        table.on("cellEdited", function(cell){
          const updatedData = cell.getData();
          const updatedField = cell.getField();
          const updatedValue = cell.getValue();
          fetch(`${apiUrl}/players/${updatedData.Id}/${updatedField}`, {
            method: 'PUT',
            //headers: {'Content-Type': 'application/json'},
            body: updatedValue
          })
          .then(response => response.text())
          .then(data => {
            console.log('Data updated successfully', data);
          })
          .catch((error) => {
            console.error('Error updating data', error);
          });
        }
        );
        return () => table.destroy();
      });
    }, []);  

  return <div ref={tableRef}></div>;
};

export default PlayerList;