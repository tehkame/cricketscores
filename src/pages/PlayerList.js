import React, { useEffect, useRef } from 'react';
import { Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';

const PlayerList = () => {
  const tableRef = useRef(null);

  useEffect(() => {
    fetch('https://csapi-b6cvdxergbf9h5e7.australiasoutheast-01.azurewebsites.net/playerlist')
      .then((response) => response.json())
      .then((tabledata) => {
        const table = new Tabulator(tableRef.current, {
          layout:'fitColumns',
          data: tabledata,
          columns: [
            { title: 'Name', 
              field: 'Name', 
              editor: 'input', 
              editable: true,
              editorParams:{ selectContents:true}
            },
            { 
              title: 'Attributes', 
              field: 'Attributes' 
            },
            { 
              title: '🏏', 
              field: 'Bat' ,
              editable: true,
              editor: 'number', 
              editorParams:{ selectContents:true}
            },
            { 
              title: '◐', 
              field: 'Bowl',
              editable: true, 
              editor:'number', 
              editorParams:{selectContents:true}
            },
          ],
        });
        return () => table.destroy();
      });
    }, []);  

  return <div ref={tableRef}></div>;
};

export default PlayerList;