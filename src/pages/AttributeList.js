import React from "react";

const AttributeList = ({ selectedIndices, playerId }) => {
  const handleToggle = (index) => {

  };

  // Example list of items
  const items = [
    ["Opener","Op"],
    ["Spin","Sp"],
    ["Wicket Keeper","WK"],
    ["Pace","Pc"],
    ["Captain","Cp"],
  ]

  return (
    <div>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={selectedIndices.has(index)}
              onChange={() => handleToggle(index)}
            />
            {item[0]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttributeList;