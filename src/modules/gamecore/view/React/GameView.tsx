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
  const defaultCharacter1 = CharacterFactory.createDefaultCharacter(1, 'John Doe', 'US', 25, '/character_1.png');
  const defaultCharacter2 = CharacterFactory.createDefaultCharacter(1, 'John Doe', 'US', 25, '/character_2.png');
  const defaultCharacter3 = CharacterFactory.createDefaultCharacter(1, 'John Doe', 'US', 25, '/character_3.png');
  const characters = [defaultCharacter1, defaultCharacter2, defaultCharacter3];
  return (
    <div>
      <div className={'HUD-container'}>
        <RoundStatusBar nextRound={() => presenter.nextRound()} round={presenter.getCurrentRound()} />
        <GameCharacterLayout character={characters} />
      </div>
      <BabylonScene antialias={true} onSceneReady={babylon.onSceneReady} onRender={babylon.onRender} />
    </div>
  );
};
