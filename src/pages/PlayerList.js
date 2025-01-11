import React, { useEffect, useRef } from 'react';
//import { createRoot } from 'react-dom/client';
import { Tabulator, EditModule, FormatModule, PopupModule } from 'tabulator-tables';
//import AttributeList from "./AttributeList";
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

Tabulator.registerModule([EditModule, FormatModule, PopupModule]);

const apiUrl = 'https://csapi-b6cvdxergbf9h5e7.australiasoutheast-01.azurewebsites.net';

const attributeList = [
  ["Opener","Op"],
  ["Spin","Sp"],
  ["Wicket Keeper","WK"],
  ["Pace","Pc"],
  ["Captain","Cp"],
]

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
            { title: 'Name', field: 'Name',  editor: 'input', editorParams:{ selectContents:true}, minWidth: 200, widthGrow: 1},
            { title: '', field: 'Attributes', width: 60, formatter: function(cell, formatterParams, onRendered){
                const value = cell.getValue();
                if (!value) return "+";
                return value.split(",").map(num=>attributeList[parseInt(num)-1][1]).join("/");
              },
              clickPopup:function(e, cell, onRendered){
                const popup = document.createElement('div');
                const indexes = cell.getValue().split(",").map((val) => parseInt(val.trim()));

                var i=0;
                attributeList.forEach(att => 
                  {
                    i++;
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.id = `checkbox-${i}`;
                    checkbox.value = i;
                    checkbox.checked = indexes.includes(i);
                    const label = document.createElement("label");
                    label.htmlFor = `checkbox-${i}`;
                    label.textContent = att[0];
                    const lineBreak = document.createElement("br");
                    popup.appendChild(checkbox);
                    popup.appendChild(label);
                    popup.appendChild(lineBreak);
                  });

                  popup.onblur = () => {
                    const updatedIndices = Array.from(popup.querySelectorAll("input:checked")).map(
                      (checkbox) => (parseInt(checkbox.dataset.index)+1).toString()
                    );
                    console.log(updatedIndices);
                    cell.getRow().update({ Attributes: updatedIndices.join(',') });
                };
                //createRoot(popup).render(<AttributeList items={attributeList} selectedIndices={player.Attributes ? player.Attributes.split(",").map(num=>parseInt(num)) : []}/>);
                return popup;
            }
            },
            { title: '🏏', field: 'Bat', editor: 'number', editorParams:{ selectContents:true}, width: 10 },
            { title: '◐', field: 'Bowl', editor:'number', editorParams:{selectContents:true}, width: 10 }
          ],
        });
        table.on("cellEdited", function(cell){
          const isNumeric = cell.getColumn().getDefinition().editor === 'number';
          var value = cell.getValue();
          if (!isNumeric) value = `'${value}'`;
          fetch(`${apiUrl}/players/${cell.getData().Id}/${cell.getField()}`, {method: 'PUT',body: value})
            .catch((error) => console.error('Error updating data', error));
        });
        tabulatorRef.current = table;
        return () => table.destroy();
      });
    }, []);  

    const addRecord = () => {
      if (tabulatorRef.current) {
        tabulatorRef.current.addData([{Name: 'New Value 1',Bat: 1, Bowl: 1}], true).then(function(rows){
          fetch(`${apiUrl}/new/players`)
          .then((response) => response.text())
          .then(data => rows[0].update({"Id":data}))
          .catch((error) => console.error('Error adding new record', error));
      });
      }
    };

  return  <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center pt-4">
            <button onClick={addRecord} class="btn btn-primary mb-3">New Player</button>
            <div ref={tableRef}></div>
          </div>
};

export default PlayerList;