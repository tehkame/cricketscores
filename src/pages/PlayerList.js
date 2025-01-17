import React, { useEffect, useRef, useState } from 'react';
import { Tabulator, EditModule, FormatModule, PopupModule } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

Tabulator.registerModule([EditModule, FormatModule, PopupModule]);

const apiUrl = 'https://csapi-b6cvdxergbf9h5e7.australiasoutheast-01.azurewebsites.net';

const numberOf = (obj) => Object.keys(obj).length;

const PlayerList = () => {

  const tableRef = useRef(null);
  const tabulatorRef = useRef(null);

  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/state/manageplayers`)
      .then((response) => response.json())
      .then((responseJson) => {
        setPageData(responseJson)
      });
  }, []);

  useEffect(() => {
        if(!pageData) return;
        const {attributes, modifiers } = pageData.lookups;
        const table = new Tabulator(tableRef.current, {
          data: pageData.tables.playerData,
          columns: [
            { title: 'Name', field: 'Name',  editor: 'input', editorParams:{ selectContents:true}, minWidth: 200, widthGrow: 1},
            { title: '', field: 'Attributes', width: 80, formatter: function(cell, formatterParams, onRendered){
                const value = cell.getValue();
                if (!value) return "+";
                return value.split(",").map(num=>attributes[num].ShortName).join("/");
              },
              clickPopup:function(e, cell, onRendered){
                const popup = document.createElement('div');
                const cellVal = cell.getValue();
                const cellRow = cell.getRow();
                const playerData =  cellRow.getData();
                const playerId = playerData.Id;
                const indexes = cellVal ? cell.getValue().split(",").map((val) => parseInt(val.trim())) : [];

                const numberOfAttributes = numberOf(attributes);
                for (let i = 1; i <= numberOfAttributes; i++)
                {
                  const checkbox = document.createElement("input");
                  checkbox.type = "checkbox";
                  checkbox.id = `att-${i}`;
                  checkbox.value = i;
                  checkbox.checked = indexes.includes(i);
                  checkbox.addEventListener('change', function() {
                    const selectedIndexes = Array.from(popup.querySelectorAll("input:checked[id*=\"att\"]")).map(
                      (checkbox) => parseInt(checkbox.value)
                    );
                    cell.setValue(selectedIndexes.join(","));
                    if (this.checked) {
                      fetch(`${apiUrl}/attributions/players/${playerId}`, {method: 'POST',body: i.toString()})
                        .catch((error) => console.error('Error updating data', error));
                    } else {
                      fetch(`${apiUrl}/attributions/players/${playerId}/${i.toString()}`, {method: 'DELETE'})
                      .catch((error) => console.error('Error updating data', error));
                    }
                  });
                  const label = document.createElement("label");
                  label.htmlFor = `checkbox-${i}`;
                  label.textContent = attributes[i].Name;
                  popup.appendChild(checkbox);
                  popup.appendChild(label);
                  popup.appendChild(document.createElement("br"));
                };

                const numberOfModifiers = numberOf(modifiers);
                for (let i = 1; i <= numberOfModifiers; i++)
                  {
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.id = `mod-${i}`;
                    checkbox.value = i;
                    checkbox.checked = playerData.Modifier === i;
                    checkbox.addEventListener('change', function() {                     
                      if (this.checked) {
                        cellRow.update({Modifier: i});
                        fetch(`${apiUrl}/players/${cell.getData().Id}/Modifier`, {method: 'PUT',body: i})
                          .catch((error) => console.error('Error updating modifier', error));
                          const partner = Array.from(popup.querySelectorAll(i === 2 ? '#mod-1' : '#mod-2'))[0];
                          partner.checked = false;
                      } else {
                        cellRow.update({Modifier: null});
                        fetch(`${apiUrl}/players/${cell.getData().Id}/Modifier`, {method: 'DELETE'})
                          .catch((error) => console.error('Error deleting modifier', error));
                      }
                    });
                    const label = document.createElement("label");
                    label.htmlFor = `checkbox-${i}`;
                    const modText = modifiers[i];
                    label.textContent = `${modText.Name} (${modText.ShortName})`;
                    popup.appendChild(checkbox);
                    popup.appendChild(label);
                    popup.appendChild(document.createElement("br"));
                  };
                

                return popup;
            }
            },
            { title: '🏏', field: 'Bat', editor: 'number', hozAlign: "right", editorParams:{ selectContents:true}, width: 15 },
            { title: '', field: 'Modifier', width: 10, hozAlign: "left", formatter: function(cell, formatterParams, onRendered){
              const value = cell.getValue();
              if (!value) return "";
              return 'x'+value;
            } },
            { title: '◐', field: 'Bowl', hozAlign: "right", editor:'number', editorParams:{selectContents:true}, width: 15 }
          ],
        });
        table.on("cellEdited", function(cell){
          const fieldName = cell.getField();
          if (['Attributes','Modifiers'].includes(fieldName)) return;
          const isNumeric = cell.getColumn().getDefinition().editor === 'number';
          var value = cell.getValue();
          if (!isNumeric) value = `'${value}'`;
          fetch(`${apiUrl}/players/${cell.getData().Id}/${fieldName}`, {method: 'PUT',body: value})
            .catch((error) => console.error('Error updating data', error));
        });
        tabulatorRef.current = table;
        return () => table.destroy();
    }, [pageData]);  

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
    {pageData ? 
    (
      <div>
        <button onClick={addRecord} class="btn btn-primary mb-3">New Player</button>
        <div ref={tableRef}></div>
      </div>
    ) :
    (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div class="spinner-border" role="status"/>
      </div>
    )
        }
                    
          </div>
};

export default PlayerList;