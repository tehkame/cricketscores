import React, { useEffect, useRef, useState } from 'react';
import { Tabulator, FormatModule } from 'tabulator-tables';
import { useParams } from 'react-router-dom';
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

Tabulator.registerModule([FormatModule]);

const apiUrl = 'https://csapi-b6cvdxergbf9h5e7.australiasoutheast-01.azurewebsites.net';

const Match = () => {
  const { matchId } = useParams();

  const [pageData, setPageData] = useState(null);

    useEffect(() => {
      fetch(`${apiUrl}/state/match/${matchId}`)
        .then((response) => response.json())
        .then((responseJson) => {
          setPageData(responseJson)
        });
    }, [matchId]);

    useEffect(() => {
      if(!pageData) return;
},[pageData]);

    const {Teams} = pageData;

  return  <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center pt-4">
    {pageData ? 
    (
            
          <div className="mb-3 w-100">
             <div className="border rounded p-1"><span className="fw-bold d-block w-100">Game Name</span></div>
            <div className="d-flex justify-content-between">

              <div>
              <div className="border rounded p-1"><span className="fw-bold d-block">${pageData?.teams[0].Name}</span></div>
              <div className="border rounded p-1"><span className="fw-bold d-block">${Teams[1].Name}</span></div>
              </div>

              <div>
              <div className="border rounded p-1"><span className="fw-bold d-block">1</span></div>
              <div className="border rounded p-1"><span className="fw-bold d-block">2</span></div>
              </div>

              <div>
              <div className="border rounded p-1"><span className="fw-bold d-block">3</span></div>
              <div className="border rounded p-1"><span className="fw-bold d-block">4</span></div>
              </div>

            </div>
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

export default Match;