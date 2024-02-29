import { RoundStatusBar } from './RoundStatusBar.tsx';
import React from 'react';
import { BabylonScene } from '../../../../component/BabylonScene.tsx';
import { GameCorePresenter } from '../../presenter/GameCorePresenter.ts';
import { CharacterFactory } from '../../../character/BuilderFactory/CharacterFactory';
import GameCharacterLayout from '../../../character/view/React/GameCharacterLayout';
import InventoryLayout from '../../../inventory/view/React/InventoryLayout.tsx';
import { Inventory } from '../../../inventory/model/Inventory.ts';
import { UsableObject } from '../../../object/model/UsableObject.ts';
import { Scene } from '@babylonjs/core';

interface GameViewProps {
  presenter: GameCorePresenter;
  babylon: { onSceneReady: (scene: Scene) => void; onRender: (scene: Scene) => void };
}

enum ModalType {
  INVENTORY,
  EVENTS,
}

const GameView: React.FC<GameViewProps> = ({ presenter, babylon }) => {
  const defaultCharacter1 = CharacterFactory.createDefaultCharacter(1, 'John Doe', 'US', 25, '/character_1.png');
  const defaultCharacter2 = CharacterFactory.createDefaultCharacter(1, 'John Doe', 'US', 25, '/character_2.png');
  const defaultCharacter3 = CharacterFactory.createDefaultCharacter(1, 'John Doe', 'US', 25, '/character_3.png');
  const characters = [defaultCharacter1, defaultCharacter2, defaultCharacter3];

  const inventory1 = new Inventory();
  const inventory2 = new Inventory();
  const inventory3 = new Inventory();
  for (let i = 0; i < 10; i++) {
    inventory1.addItem(new UsableObject('vite.svg', 'vite.svg'));
    if (i % 2 === 0) {
      inventory1.addItem(new UsableObject('vite.svg', 'vite.svg'));
    }
    inventory2.addItem(new UsableObject('vite.svg', 'vite.svg'));
    if (i % 3 == 0) {
      inventory3.addItem(new UsableObject('vite.svg', 'vite.svg'));
    }
  }
  const inventoryList = [inventory1, inventory2, inventory3];

  const [isInventoryOpen, setIsInventoryOpen] = React.useState(false);
  const [isEventOpen, setIsEventOpen] = React.useState(false);

  const toggleModal = (type: ModalType, isOpen: boolean) => {
    switch (type) {
      case ModalType.INVENTORY:
        setIsInventoryOpen(isOpen);
        setIsEventOpen(false);
        break;
      case ModalType.EVENTS:
        setIsEventOpen(isOpen);
        setIsInventoryOpen(false);
        break;
    }
  };

  const isModalOpen = (type: ModalType): boolean => {
    switch (type) {
      case ModalType.INVENTORY:
        return isInventoryOpen;
      case ModalType.EVENTS:
        return isEventOpen;
    }
  };

  return (
    <div>
      <div className={'HUD-container'}>
        <RoundStatusBar
          nextRound={() => presenter.nextRound()}
          round={presenter.getCurrentRound()}
          toggleModal={toggleModal}
          isModalOpen={isModalOpen}
        />
        <div>
          {isInventoryOpen &&
            <InventoryLayout
              inventory={inventoryList}
              toggleModal={toggleModal}
              isModalOpen={isModalOpen}
            />}
        </div>
        <GameCharacterLayout character={characters} />
      </div>
      <BabylonScene babylonMainView={presenter.babylonView} />
    </div>
  );
};

export { ModalType, GameView }