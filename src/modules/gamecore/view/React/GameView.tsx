import BabylonScene from '../../../../component/BabylonScene.tsx';
import { RoundStatusBar } from './RoundStatusBar.tsx';
import { MainView } from './MainView.tsx';
import React from 'react';
import { Scene } from '@babylonjs/core';

interface GameViewProps {
  mainView: MainView;
  babylon: { onSceneReady: (scene: Scene) => void; onRender: (scene: Scene) => void };
}

export const GameView: React.FC<GameViewProps> = ({ mainView, babylon }) => {
  return (
    <div>
      <BabylonScene antialias={true} onSceneReady={babylon.onSceneReady} onRender={babylon.onRender} id="my-canvas" />
      <div className={'HUD'}>
        <RoundStatusBar nextRound={() => mainView.nextRound()} round={mainView.getCurrentRound()} />
      </div>
    </div>
  );
};
