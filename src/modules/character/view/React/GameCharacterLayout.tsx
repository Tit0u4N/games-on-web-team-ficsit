import React from 'react';
import CharacterLayout from './CharacterLayout';
import { Character } from '../../model/Character';

interface GameCharacterLayoutProps {
  character: Character[];
}

const GameCharacterLayout: React.FC<GameCharacterLayoutProps> = ({ character }) => {
  const numberOfCharacters = 3;

  return (
    <div className='flex justify-between absolute bottom-0 left-0 right-0 p-4'>
      {Array.from({ length: numberOfCharacters }, (_, index) => (
        <CharacterLayout key={index} character={character[index]} />
      ))}
    </div>
  );
};

export default GameCharacterLayout;
