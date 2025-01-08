import React, { useEffect, useRef } from 'react';
import { Tabulator, EditModule } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';

Tabulator.registerModule([EditModule]);

const apiUrl = 'https://csapi-b6cvdxergbf9h5e7.australiasoutheast-01.azurewebsites.net';



function colDef(field, editor, title, widthGrow) {
  return { 
    title: title || field, 
    field: field, 
    editor: editor,
    editorParams: editor ? { selectContents:true} : null,
    widthGrow: widthGrow
  }
}

const attributeList = {
  1: ["Opener","Op"],
  2: ["Spin","Sp"],
  3: ["Wicket Keeper","WK"],
  4: ["Pace","Pc"],
  5: ["Captain","Cp"],
}

const PlayerList = () => {
  const tableRef = useRef(null);

  useEffect(() => {
    fetch(`${apiUrl}/views/playerlist`)
      .then((response) => response.json())
      .then((tabledata) => {
        const table = new Tabulator(tableRef.current, {
          layout:'fitDataStretch',
          data: tabledata,
          columns: [
            { 
              title: 'Name', 
              field: 'Name', 
              editor: 'input',
              editorParams:{ selectContents:true},
              minWidth: 200
            },
            { 
              title: 'Attributes', 
              field: 'Attributes',
              formatter: function(cell, formatterParams, onRendered){
                return cell.getValue().split(",").map(num=>attributeList[num][1]).join("/");
              },
              width: 15
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
        return () => table.destroy();
      });
    }, []);  

  return <div ref={tableRef}></div>;
};

export default PlayerList;