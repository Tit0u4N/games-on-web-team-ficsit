import BabylonScene from '../../../../component/BabylonScene.tsx';
import { RoundStatusBar } from './RoundStatusBar.tsx';
import React from 'react';
import { Scene } from '@babylonjs/core';
import { GameCorePresenter } from '../../presenter/GameCorePresenter.ts';

interface GameViewProps {
  presenter: GameCorePresenter;
  babylon: { onSceneReady: (scene: Scene) => void; onRender: (scene: Scene) => void };
}

export const GameView: React.FC<GameViewProps> = ({ presenter, babylon }) => {
  return (
    <div>
      <div className={'HUD-container'}>
        <RoundStatusBar nextRound={() => presenter.nextRound()} round={presenter.getCurrentRound()} />
      </div>
      <BabylonScene antialias={true} onSceneReady={babylon.onSceneReady} onRender={babylon.onRender} />
    </div>
  );
};
