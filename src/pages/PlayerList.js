import React, { useEffect, useRef } from 'react';
import { Tabulator, EditModule, FormatModule } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

Tabulator.registerModule([EditModule, FormatModule]);

const apiUrl = 'https://csapi-b6cvdxergbf9h5e7.australiasoutheast-01.azurewebsites.net';

const attributeList = {
  1: ["Opener","Op"],
  2: ["Spin","Sp"],
  3: ["Wicket Keeper","WK"],
  4: ["Pace","Pc"],
  5: ["Captain","Cp"],
}

const PlayerList = () => {
  const tableRef = useRef(null);
  const tabulatorRef = useRef(null);
  useEffect(() => {
    fetch(`${apiUrl}/views/playerlist`)
      .then((response) => response.json())
      .then((tabledata) => {
        const table = new Tabulator(tableRef.current, {
          layout:'fitColumns',
          data: tabledata,
          columns: [
            { 
              title: 'Name', 
              field: 'Name', 
              editor: 'input',
              editorParams:{ selectContents:true},
              minWidth: 200,
              widthGrow: 1
            },
            { 
              title: '', 
              field: 'Attributes',
              formatter: function(cell, formatterParams, onRendered){
                const value = cell.getValue();
                if (value===null) return "+";
                return cell.getValue().split(",").map(num=>attributeList[num][1]).join("/");
              },
              width: 60
            },
            { 
              title: '🏏', 
              field: 'Bat' ,
              editor: 'number', 
              editorParams:{ selectContents:true},
              width: 10
            },
            { 
              title: '◐', 
              field: 'Bowl',
              editor:'number', 
              editorParams:{selectContents:true},
              width: 10
            }
          ],
        });
        table.on("cellEdited", function(cell){
          const isNumeric = cell.getColumn().getDefinition().editor === 'number';
          var value = cell.getValue();
          if (!isNumeric) value = `'${value}'`;
          fetch(`${apiUrl}/players/${cell.getData().Id}/${cell.getField()}`, {method: 'PUT',body: value})
            .then(data => console.log('Data updated successfully', data))
            .catch((error) => console.error('Error updating data', error));
        });
        tabulatorRef.current = table;
        return () => table.destroy();
      });
    }, []);  

    const addRecord = () => {
      // Example of new data you want to add
      const newRecord = {
        Name: 'New Value 1',
        Bat: 1,
        Bowl: 1,
      };
  
      // Add the new record to the table using Tabulator API
      if (tabulatorRef.current) {
        tabulatorRef.current.addData([newRecord]);
      }
    };

  return  <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center pt-4">
            <button onClick={addRecord} class="btn btn-primary mb-3">Add Record</button>
            <div ref={tableRef}></div>
          </div>
};

export default PlayerList;