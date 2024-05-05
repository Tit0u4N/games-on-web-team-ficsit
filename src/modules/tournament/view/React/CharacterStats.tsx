import { Character } from '../../../character/model/Character.ts';
import React from 'react';

type CharacterStatsProps = {
  character: Character;
};

export const CharacterStats: React.FC<CharacterStatsProps> = ({ character }) => {
  return (
    <div className={'flex'}>
      <div className={'w-1/3'}></div>
      <div className={'w-2/3'}></div>
    </div>
  );
};
