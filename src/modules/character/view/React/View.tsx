import React from 'react';
import { Character } from '../../model/Character';

// Use the Character model
const AthLayout: React.FC<Character> = (character: Character) => {
  return (
    <div>
      {/* Render player information */}
      <div>Player Name: {character.name}</div>
      <div>Player Age: {character.age}</div>
      <div>Player Nationality: {character.nationality}</div>
      <div>{character.inventory.toString()}</div>
      <div>{character.statistics.toString()}</div>
      <div>{character.attributes.toString()}</div>
    </div>
  );
};

export default AthLayout;
