import React, { useEffect, useRef } from 'react';
import { Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';

const PlayerList = () => {
  const tableRef = useRef(null);

  useEffect(() => {
    const table = new Tabulator(tableRef.current, {
      layout:'fitColumns',
      data: [
        { Id: 1, Name: 'Donald Bradman', Bat: 4, Bowl: 1, Attributes: 'Op/Sp' },      
        { Id: 1, Name: 'Sachin Tendulkar', Bat: 4, Bowl: 1, Attributes: 'WK' },    
        { Id: 1, Name: 'Virat Kohli', Bat: 3, Bowl: 1, Attributes: null },    
        { Id: 1, Name: 'Jacques Kallis ', Bat: 3, Bowl: 2, Attributes: null },    
      ],
      columns: [
        { title: 'Name', field: 'Name' },
        { title: 'Attributes', field: 'Attributes' },
        { title: 'Bat', field: 'Bat' },
        { title: 'Bowl', field: 'Bowl' },
      ],
    });
    return () => table.destroy();
  }, []);

  return <div ref={tableRef}></div>;
};

export default PlayerList;