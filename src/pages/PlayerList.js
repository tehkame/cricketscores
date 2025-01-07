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
          layout:'fitData',
          data: tabledata,
          columns: [
            colDef('Name', 'input', 'Name', 1),
            colDef('Attributes'),
            colDef('Bat','number','🏏'),
            colDef('Bowl','number','◐'),
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