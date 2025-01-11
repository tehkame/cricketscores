import React from "react";
import { useParams } from 'react-router-dom';

function ManageTeam() {
  const { id } = useParams();
  return (  
  <div>Details for Team ID: {id}</div>
  );
}

export default ManageTeam;