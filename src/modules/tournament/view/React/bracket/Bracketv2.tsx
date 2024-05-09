import React from 'react';
import './Bracket.scss';
import { BracketCandidate } from './BracketCandidate.tsx';
import { Divider } from '@nextui-org/react';

type Props = {
  bracket?: Array<Round>;
};

type Round = {
  nbCandidates: number;
  candidates?: Array<string>;
};

export const Bracketv2: React.FC<Props> = ({ bracket = [] }) => {
  const defaultBracket = [{ nbCandidates: 8 }, { nbCandidates: 4 }, { nbCandidates: 2 }, { nbCandidates: 1 }];

  bracket = [...defaultBracket, ...bracket];

  const renderRound = (round: Round, divider = false) => {
    const gap = Math.round((1 / round.nbCandidates) * 32);

    return (
      <div>
        <div className={`flex justify-around w-full gap-${gap}`}>
          {Array.from({ length: round.nbCandidates }).map((_, index) => (
            <BracketCandidate key={index} />
          ))}
        </div>
        {divider && <Divider className={'mt-4'} />}
      </div>
    );
  };

  return (
    <div className={'flex flex-col-reverse items-center justify-center gap-8 size-full'}>
      {bracket.map((round, index) => renderRound(round, index !== 0))}
    </div>
  );
};
