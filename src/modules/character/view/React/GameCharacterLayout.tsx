import React from 'react';
import CharacterLayout from './CharacterLayout';
import { Character } from '../../model/Character';

interface GameCharacterLayoutProps {
  character: Set<Character>;
}

const GameCharacterLayout: React.FC<GameCharacterLayoutProps> = ({ character }) => {
  return (
    <div className="flex justify-between absolute bottom-0 left-0 right-0 p-4">
      {Array.from(character).map((character, index) => (
        <CharacterLayout key={index} character={character} />
      ))}
    </div>
  );
};

export default GameCharacterLayout;
