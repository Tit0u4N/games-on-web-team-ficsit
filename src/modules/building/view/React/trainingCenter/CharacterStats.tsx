import React from 'react';
import { Character } from '../../../../character/model/Character.ts';
import { Divider } from '@nextui-org/react';

interface CharacterStatsProps {
  character: Character;
}

export const CharacterStats: React.FC<CharacterStatsProps> = ({ character }) => {
  const stats = character.statistics;

  return (
    <div className="w-full h-[300px]">
      <div className="flex justify-between p-[10px] h-[80%] w-full">
        <div className="flex flex-col w-1/3 h-[80%] gap-1 rounded-xl bg-case">
          {character.image && (
            <img src={character.image} alt={character.name} className="w-[90%] h-[90%] object-cover rounded-t-xl self-center" />
          )}
        </div>
        <Divider orientation={'vertical'} className={'ml-4 mr-4'} />
        <div className="w-[50%] h-full overflow-y-auto">
          <h3>{character.name}</h3>
          {Array.from(stats.entries()).map(([sport, value]) => (
            <div key={sport.name}>
              {sport.name}: {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
