import React from 'react';
import { Button } from '@nextui-org/react';
import { MainView } from './MainView.tsx';

interface Props {
  view: MainView;
}

export const MenuView: React.FC<Props> = ({ view }) => {
  return (
    <div className={'HUD'}>
      <div className={'h-full bg-background'}>
        <div className={'flex flex-col justify-center items-center h-1/2'}>
          <Button color="primary" className={'my-2 text-white'} onClick={() => view.startGame()}>
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
    </div>
  );
};
