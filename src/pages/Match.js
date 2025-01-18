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

  return  <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center pt-4">
    {pageData ? 
    (
            
          <div className="mb-3 w-100">
             <div className="d-flex justify-content-between align-items-center">

    <div className="d-flex flex-column flex-grow-1">
    <div className="border rounded p-1"><span className="fw-bold d-block w-100">{pageData.MatchName}</span></div>
      <div className="border rounded p-1">
        <span className="d-block">{pageData.Teams[0].Name}</span>
      </div>
      <div className="border rounded p-1">
        <span className="d-block">{pageData.Teams[1].Name}</span>
      </div>
    </div>

    <div className="d-flex flex-column flex-shrink-0 mx-2">
    <div className="border rounded p-1">
        <span className="fw-bold d-block">1st</span>
      </div>
      <div className="border rounded p-1">
        <span className="d-block">{pageData.Teams[0].Score1 ?? "0"}</span>
      </div>
      <div className="border rounded p-1">
        <span className="d-block">{pageData.Teams[1].Score1 ?? "\u2003"}</span>
      </div>
    </div>

    <div className="d-flex flex-column flex-shrink-0">
    <div className="border rounded p-1">
        <span className="fw-bold d-block">2nd</span>
      </div>
      <div className="border rounded p-1">
        <span className="fw-bold d-block">{pageData.Teams[0].Score2 ?? "\u2003"}</span>
      </div>
      <div className="border rounded p-1">
        <span className="fw-bold d-block">{pageData.Teams[1].Score2 ?? "\u2003"}</span>
      </div>
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