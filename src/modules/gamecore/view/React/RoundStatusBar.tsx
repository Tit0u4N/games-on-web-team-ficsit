import { Button } from '@nextui-org/react';
import React from 'react';

interface RoundStatusBarProps {
  nextRound: () => void;
  round: number;
}

export const RoundStatusBar: React.FC<RoundStatusBarProps> = ({ nextRound, round }) => {
  return (
    <div className={'bottom-bar bg-primary'}>
      <div className={'round-status'}>Round {round}</div>
      <Button className={'next-round-btn'} onClick={() => nextRound()}>
        Next round
      </Button>
    </div>
  );
};
