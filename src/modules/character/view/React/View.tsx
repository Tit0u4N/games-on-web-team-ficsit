import React, { useState } from 'react';

interface AthLayoutProps {
  // Define props for passing information to ATH layout
  characterName: string;
  characterStats: number;
  // TODO: add more props as needed
}

const AthLayout: React.FC<AthLayoutProps> = ({ characterName, characterStats }) => {

  const [todo, setTodo] = useState();

  return (
    <div>
      {/* Render player information */}
      <div>Player Name: {characterName}</div>
      <div>Player Score: {characterStats}</div>
    </div>
  );
};

export default AthLayout;
