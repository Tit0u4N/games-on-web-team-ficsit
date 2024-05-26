import React from 'react';
import { Character } from '../../../../character/model/Character.ts';
import { Divider, Image } from '@nextui-org/react';
import { TrainingChoice } from './TrainingChoiceCards.tsx';
import { TrainingCenterModel } from '../../../model/TrainingCenterModel.ts';

interface CharacterStatsProps {
  character: Character;
  selectedCharacter: Character | null;
  trainingCenter: TrainingCenterModel | null;
  choice: TrainingChoice | null;
}

export const CharacterStats: React.FC<CharacterStatsProps> = ({
  character,
  selectedCharacter,
  trainingCenter,
  choice,
}) => {
  const stats = character.statistics;

  return (
    <div className={'flex  flex-col w-full h-full overflow-hidden'}>
      <div className={'flex w-full'}>
        <div className={'h-full aspect-square'}>
          {character.image && <Image radius={'lg'} src={character.image} alt={character.name} width={50} height={50} />}
        </div>
        <div className={'h-full flex flex-col items-center'}>
          <h3 className={'text-xl'}>{character.name}</h3>
        </div>
      </div>
      <Divider />
      <div className={'ml-2 grid grid-cols-3 gap-1'}>
        {Array.from(stats.entries()).map(([sport, value]) => (
          <div className={'text-sm'} key={sport.name}>
            {sport.name}: {value}
            {trainingCenter?.sports.includes(sport) && choice !== null && selectedCharacter === character && (
              <span className="text-green-500">{' + ' + choice.stats}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
