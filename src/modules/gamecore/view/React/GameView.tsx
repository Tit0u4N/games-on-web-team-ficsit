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
      <BabylonScene antialias={true} onSceneReady={babylon.onSceneReady} onRender={babylon.onRender} id="my-canvas" />
      <div className={'HUD'}>
        <RoundStatusBar nextRound={() => presenter.nextRound()} round={presenter.getCurrentRound()} />
      </div>
    </div>
  );
};
