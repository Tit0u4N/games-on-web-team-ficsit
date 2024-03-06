import { RoundStatusBar } from './RoundStatusBar.tsx';
import React from 'react';
import { BabylonScene } from '../../../../component/BabylonScene.tsx';
import { GameCorePresenter } from '../../presenter/GameCorePresenter.ts';
import GameCharacterLayout from '../../../character/view/React/GameCharacterLayout';
import InventoryLayout from '../../../inventory/view/React/InventoryLayout.tsx';
import EventLayout from '../../../event/view/React/EventLayout.tsx';
import { CharacterPresenter } from '../../../character/presenter/CharacterPresenter.ts';
import { InventoryPresenter } from '../../../inventory/presenter/InventoryPresenter.ts';
import { EventPresenter } from '../../../event/presenter/EventPresenter.ts';

interface GameViewProps {
  presenter: GameCorePresenter;
}

enum ModalType {
  INVENTORY,
  EVENTS,
}

const GameView: React.FC<GameViewProps> = ({ presenter }) => {
  /* Test Data */

  const characterPresenter = new CharacterPresenter();
  const inventoryPresenter = new InventoryPresenter();
  const eventPresenter = new EventPresenter();

  const characters = characterPresenter.getDefaultCharacters();
  const inventoryList = inventoryPresenter.getDefaultInventories();
  const events = eventPresenter.getDefaultEvents();

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
