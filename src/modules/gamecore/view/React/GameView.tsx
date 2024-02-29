import { RoundStatusBar } from './RoundStatusBar.tsx';
import React from 'react';
import { BabylonScene } from '../../../../component/BabylonScene.tsx';
import { GameCorePresenter } from '../../presenter/GameCorePresenter.ts';
import { CharacterFactory } from '../../../character/BuilderFactory/CharacterFactory';
import GameCharacterLayout from '../../../character/view/React/GameCharacterLayout';
import InventoryLayout from '../../../inventory/view/React/InventoryLayout.tsx';
import { Inventory } from '../../../inventory/model/Inventory.ts';
import { UsableObject } from '../../../object/model/UsableObject.ts';
import EventLayout from '../../../event/view/React/EventLayout.tsx';
import { EventModel } from '../../../event/model/EventModel.ts';

interface GameViewProps {
  presenter: GameCorePresenter;
}

enum ModalType {
  INVENTORY,
  EVENTS,
}

const GameView: React.FC<GameViewProps> = ({ presenter }) => {
  /* Test Data */
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

  const event1 = new EventModel(1, 'This is the first event');
  const event2 = new EventModel(2, 'This is the second event');
  const event3 = new EventModel(3, 'This is the third event');
  const event4 = new EventModel(3, 'This is the third event');
  const event5 = new EventModel(3, 'This is the third event');
  const event6 = new EventModel(3, 'This is the 5 event');
  const event7 = new EventModel(3, 'This is the 7 event');
  const event8 = new EventModel(3, 'This is the 8 event');

  const events = [event1, event2, event3, event4, event5, event6, event7, event8];

  /* End Test Data */

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
          {isInventoryOpen && (
            <InventoryLayout inventory={inventoryList} toggleModal={toggleModal} isModalOpen={isModalOpen} />
          )}
        </div>
        <div>
          <EventLayout event={events} toggleModal={toggleModal} isModalOpen={isModalOpen} />
        </div>
        <GameCharacterLayout character={characters} />
      </div>
      <BabylonScene babylonMainView={presenter.babylonView} />
    </div>
  );
};

export { ModalType, GameView };
