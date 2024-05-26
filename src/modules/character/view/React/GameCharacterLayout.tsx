import React from 'react';
import CharacterLayout from './CharacterLayout';
import { Character } from '../../model/Character';
import { Season } from '../../../../core/singleton/Season.ts';

interface GameCharacterLayoutProps {
  character: Set<Character>;
  season: Season;
}

const GameCharacterLayout: React.FC<GameCharacterLayoutProps> = ({ character, season }) => {
  return (
    <div className="flex justify-between absolute bottom-0 left-0 right-0 p-4">
      {Array.from(character).map((character, index) => (
        <CharacterLayout key={index} character={character} season={season} />
      ))}
    </div>
  );
};

export default GameCharacterLayout;
