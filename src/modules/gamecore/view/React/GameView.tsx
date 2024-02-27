import BabylonScene from '../../../../component/BabylonScene.tsx';
import { RoundStatusBar } from './RoundStatusBar.tsx';
import React from 'react';
import { Scene } from '@babylonjs/core';
import { GameCorePresenter } from '../../presenter/GameCorePresenter.ts';
import { CharacterFactory } from '../../../character/BuilderFactory/CharacterFactory';
import GameCharacterLayout from '../../../character/view/React/GameCharacterLayout';

interface GameViewProps {
  presenter: GameCorePresenter;
  babylon: { onSceneReady: (scene: Scene) => void; onRender: (scene: Scene) => void };
}

export const GameView: React.FC<GameViewProps> = ({ presenter, babylon }) => {
  const defaultCharacter = CharacterFactory.createDefaultCharacter(1, 'John Doe', 'US', 25, '/vite.svg');
  return (
    <div>
      <div className={'HUD-container'}>
        <RoundStatusBar nextRound={() => presenter.nextRound()} round={presenter.getCurrentRound()} />
        <GameCharacterLayout character={defaultCharacter} />
      </div>
      <BabylonScene antialias={true} onSceneReady={babylon.onSceneReady} onRender={babylon.onRender} />
    </div>
  );
};
