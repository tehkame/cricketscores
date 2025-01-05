import React, { useEffect, useRef } from 'react';
import { Tabulator, EditModule } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';

Tabulator.registerModule([EditModule]);

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
        return () => table.destroy();
      });
    }, []);  

  return <div ref={tableRef}></div>;
};

export default PlayerList;