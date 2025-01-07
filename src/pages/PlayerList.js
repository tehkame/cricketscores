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

const PlayerList = () => {
  const tableRef = useRef(null);

  useEffect(() => {
    fetch(`${apiUrl}/views/playerlist`)
      .then((response) => response.json())
      .then((tabledata) => {
        const table = new Tabulator(tableRef.current, {
          layout:'fitDataFill',
          data: tabledata,
          columns: [
            { title: 'Name', 
              field: 'Name', 
              editor: 'input',
              editorParams:{ selectContents:true},
              widthGrow: 1
            },
            colDef('Attributes'),
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
          const isNumeric = cell.getColumn().getDefinition().editor === 'number';
          var value = cell.getValue();
          if (!isNumeric) value = `'${value}'`;
          fetch(`${apiUrl}/players/${cell.getData().Id}/${cell.getField()}`, {method: 'PUT',body: value})
            .then(data => console.log('Data updated successfully', data))
            .catch((error) => console.error('Error updating data', error));
        });
        table.on("cellEditing", function(cell){
          console.log(cell.getValue());
        });
        return () => table.destroy();
      });
    }, []);  

  return <div ref={tableRef}></div>;
};

export default PlayerList;