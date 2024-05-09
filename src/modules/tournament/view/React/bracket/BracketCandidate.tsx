import { Avatar, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import React from 'react';

type Props = {
  candidate?: {
    name: string;
    score: number;
    image: string;
  };
  winner?: boolean;
  className?: string;
  isDisabled?: boolean;
};

export const BracketCandidate: React.FC<Props> = ({ candidate, winner = false, isDisabled = false }) => {
  candidate = candidate || { name: 'Candidate', score: 0, image: '' };

  const classNameContainer = winner ? 'bg-primary' : 'bg-default';
  const isDisabledClass = isDisabled ? ' opacity-50' : '';

  return (
    <Popover placement={'bottom'} isOpen={isDisabled ? false : undefined}>
      <PopoverTrigger>
        <div
          className={
            'h-[60px] w-[150px] flex justify-center ms-[35px] rounded-xl ' + classNameContainer + isDisabledClass
          }>
          <div className={'flex flex-col items-center justify-center size-[60px] ms-[-35px]'}>
            <Avatar
              showFallback
              fallback={<h1 className={'text-4xl font-semibold text-gray-600 a'}> ? </h1>}
              isDisabled={winner}
              src={candidate.image}
              isBordered
              radius={'full'}
              size={'lg'}
              color={winner ? 'primary' : 'default'}
            />
          </div>
          <div className={'w-full flex flex-col items-center justify-center'}>{candidate.name}</div>
        </div>
      </PopoverTrigger>
      <PopoverContent>Statistiques du personnage</PopoverContent>
    </Popover>
  );
};
