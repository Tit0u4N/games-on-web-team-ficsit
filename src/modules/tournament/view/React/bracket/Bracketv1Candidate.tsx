import { Avatar, Badge } from '@nextui-org/react';
import React from 'react';
import { Country } from '../../../../../core/Country.tsx';

type Props = {
  candidate: Candidate;
  className?: string;
};

export type Candidate = {
  name: string;
  nationality: Country;
  image: string;
  id: number;
  score?: number;
};

export const Bracketv1Candidate: React.FC<Props> = ({ candidate }) => {
  return (
    <div className={'h-[45px] w-[135px] ms-[20px] flex justify-center rounded-xl bg-default'}>
      <div className={'flex flex-col items-center justify-center size-[40px] ms-[-20px]'}>
        <Badge color={'default'} placement={'bottom-right'} content={candidate.nationality.getFlag()}>
          <Avatar
            showFallback
            fallback={<h1 className={'text-4xl font-semibold text-gray-600 a'}> ? </h1>}
            src={candidate.image}
            isBordered
            radius={'full'}
            size={'md'}
            color={'default'}
          />
        </Badge>
      </div>
      <div className={'w-full flex flex-col items-center justify-center'}>{candidate.name}</div>
    </div>
  );
};
