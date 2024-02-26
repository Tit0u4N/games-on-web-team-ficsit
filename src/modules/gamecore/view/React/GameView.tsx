import { RoundStatusBar } from './RoundStatusBar.tsx';
import React from 'react';
import { BabylonScene } from '../../../../component/BabylonScene.tsx';
import { GameCorePresenter } from '../../presenter/GameCorePresenter.ts';

interface GameViewProps {
  presenter: GameCorePresenter;
}

export const GameView: React.FC<GameViewProps> = ({ presenter }) => {
  return (
    <div>
      <div className={'HUD-container'}>
        <RoundStatusBar nextRound={() => presenter.nextRound()} round={presenter.getCurrentRound()} />
      </div>
      <BabylonScene babylonMainView={presenter.babylonView} />
    </div>
  );
};
