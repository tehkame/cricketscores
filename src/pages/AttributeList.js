import React from "react";

const AttributeList = ({ items, selectedIndices, playerId }) => {
  const handleToggle = (index) => {

  };

  return (
    <div>
      <ul>
        {items.map((item, index) => (
            <div>
                <input
              type="checkbox"
              checked={selectedIndices.includes(index+1)}
              onChange={() => handleToggle(index+1)}
            />
            {item[0]}
            </div>           
        ))}
      </ul>
    </div>
  );
};

export default AttributeList;