import React from 'react';
import { Character } from '../../../../character/model/Character.ts';
import { Divider } from '@nextui-org/react';
import { TrainingChoice } from './TrainingChoiceCards.tsx';
import { TrainingCenterModel } from '../../../model/TrainingCenterModel.ts';

interface CharacterStatsProps {
  character: Character;
  trainingCenter: TrainingCenterModel | null;
  choice: TrainingChoice | null;
}

export const CharacterStats: React.FC<CharacterStatsProps> = ({ character, trainingCenter, choice }) => {
  const stats = character.statistics;

  return (
    <div className={"w-full h-full"}>
      <div className="flex justify-between p-[10px] h-full w-full">
        <div className="flex flex-col w-1/3 h-full gap-1 rounded-xl bg-case">
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
              {trainingCenter?.sports.includes(sport) && choice !== null && (
                <span className="text-green-500">{' + ' + choice.stats}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

