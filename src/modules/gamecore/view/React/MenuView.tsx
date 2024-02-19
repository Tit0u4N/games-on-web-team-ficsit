import React from 'react';
import { Button } from '@nextui-org/react';
import { View } from './View.tsx';

interface Props {
  view: View;
}

export const MenuView: React.FC<Props> = ({ view }) => {
  return (
    <div className={'h-full bg-background'}>
      <div className={'flex flex-col justify-center items-center h-1/2'}>
        <Button color="primary" className={'my-2 text-white'} onClick={() => view.start()}>
          Start Game
        </Button>
        <Button color="primary" className={'my-2 text-white'}>
          Options
        </Button>
        <Button color="primary" className={'my-2 text-white'}>
          Exit
        </Button>
      </div>
    </div>
  );
};
