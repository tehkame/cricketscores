import React, { useState } from "react";

const AttributeList = ({ selectedIndices, playerId }) => {
  const [checkedIndices, setCheckedIndices] = useState(new Set(selectedIndices));

  const handleToggle = (index) => {
    const newCheckedIndices = new Set(checkedIndices);
    if (newCheckedIndices.has(index)) {
      newCheckedIndices.delete(index);
    } else {
      newCheckedIndices.add(index);
    }
    setCheckedIndices(newCheckedIndices);
    //onChange([...newCheckedIndices], personId); // Pass updated indices and personId
    console.log(`Player ${playerId}`);
    console.log(checkedIndices);
  };

  // Example list of items
  const items = ["Option 1", "Option 2", "Option 3", "Option 4"];

  return (
    <div>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={checkedIndices.has(index)}
              onChange={() => handleToggle(index)}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttributeList;