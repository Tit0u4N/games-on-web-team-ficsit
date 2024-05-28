import React from 'react';
import { Character } from '../../../../character/model/Character.ts';
import { Divider, Image, Slider } from '@nextui-org/react';
import { TrainingChoice } from './TrainingChoiceCards.tsx';
import { TrainingCenterModel } from '../../../model/TrainingCenterModel.ts';
import { XpManager } from '../../../../../core/singleton/XpManager.ts';

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
    <div className={'flex w-full h-full overflow-hidden'}>
      <div className={'w-1/6 aspect-square'}>
        {character.image && <Image radius={'lg'} src={character.image} alt={character.name} width={50} height={50} />}
      </div>
      <div className={'flex flex-col w-full'}>
        <div className={'h-full flex flex-col items-center'}>
          <h3 className={'text-xl'}>{character.name}</h3>
        </div>
        <Divider />
        <div className={'ml-2 grid grid-cols-3 gap-1'}>
          {Array.from(stats.keys()).map((sport) => (
            <div className={'text-sm'} key={sport.name}>
              <div className={'text-sm'} key={sport.name}>
                {sport.name}: {stats.get(sport)}
                {trainingCenter?.sports.includes(sport) && choice !== null && selectedCharacter === character && (
                  <span className="text-green-500">{' + ' + choice.stats + 'xp'}</span>
                )}
              </div>
              <div className="-mt-1.5">
                <Slider
                  aria-label="Player progress"
                  color={
                    trainingCenter?.sports.includes(sport) && choice !== null && selectedCharacter === character
                      ? 'primary'
                      : 'foreground'
                  }
                  hideThumb={true}
                  size="sm"
                  value={
                    trainingCenter?.sports.includes(sport) && choice !== null && selectedCharacter === character
                      ? XpManager.getInstance().getUpdatePercentage(stats.getXp(sport), choice.stats).percentageFilled
                      : stats.getPercentage(sport).percentageFilled
                  }
                  minValue={0}
                  maxValue={100}
                  className="max-w-[90%] mx-auto"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
