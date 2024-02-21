import { View } from '../Babylon/View.ts';
import BabylonScene from '../../../../component/BabylonScene.tsx';
import { RoundStatusBar } from './RoundStatusBar.tsx';
import { MainView } from './MainView.tsx';
import React from 'react';

interface GameViewProps {
  mainView: MainView;
}

export const GameView: React.FC<GameViewProps> = ({ mainView }) => {
  const view = new View();
  const babylon = view.init();

  return (
    <div>
      <BabylonScene antialias={true} onSceneReady={babylon.onSceneReady} onRender={babylon.onRender} id="my-canvas" />
      <div className={'HUD'}>
        <RoundStatusBar nextRound={() => mainView.nextRound()} round={mainView.getCurrentRound()} />
      </div>
    </div>
  );
};
