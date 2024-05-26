import { RoundStatusBar } from './RoundStatusBar.tsx';
import React, { useRef } from 'react';
import { BabylonScene } from '../../../../component/BabylonScene.tsx';
import { GameCorePresenter } from '../../presenter/GameCorePresenter.ts';
import GameCharacterLayout from '../../../character/view/React/GameCharacterLayout';
import InventoriesModal from '../../../inventory/view/React/InventoriesModal.tsx';
import EventLayout from '../../../event/view/React/EventLayout.tsx';
import { Reactable } from '../../../../core/Interfaces.ts';
import { ModalManager } from '../../../../core/singleton/ModalManager.ts';

interface GameViewProps {
  presenter: GameCorePresenter;
}

enum ModalType {
  INVENTORY,
  EVENTS,
}

const GameView: React.FC<GameViewProps> = ({ presenter }) => {
  /* Test Data */

  const characters = presenter.getCharacters();
  const inventoryList = presenter.getInventoryList();
  const events = presenter.getEvents();

  /* End Test Data */

  const [isInventoryOpen, setIsInventoryOpen] = React.useState(false);
  const [isEventOpen, setIsEventOpen] = React.useState(false);
  const [modalToShow, setModalToShow] = React.useState<Reactable | null>(null);

  ModalManager.createInstance(setModalToShow);

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

  const handleResetCamera = () => {
    presenter.babylonView.arcRotateCameraKeyboardInputs.resetPositionCamera();
  };

  const zoomInTimeout = useRef<NodeJS.Timeout | null>(null);
  const zoomOutTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleZoomInMouseDown = () => {
    zoomInTimeout.current = setInterval(() => {
      presenter.babylonView.arcRotateCameraKeyboardInputs.zoomIn();
    }, 50);
  };

  const handleZoomOutMouseDown = () => {
    zoomOutTimeout.current = setInterval(() => {
      presenter.babylonView.arcRotateCameraKeyboardInputs.zoomOut();
    }, 50);
  };

  const handleZoomMouseUp = () => {
    if (zoomInTimeout.current) clearInterval(zoomInTimeout.current);
    if (zoomOutTimeout.current) clearInterval(zoomOutTimeout.current);
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
            <InventoriesModal
              inventories={inventoryList}
              toggleModal={toggleModal}
              isModalOpen={isModalOpen}
              gameCorePresenter={presenter}
            />
          )}
        </div>
        <div>
          <EventLayout event={events} toggleModal={toggleModal} isModalOpen={isModalOpen} />
        </div>
        <GameCharacterLayout character={characters} season={presenter.getCurrentSeason()} />
      </div>
      <div
        onClick={handleResetCamera}
        className={'cursor-pointer z-50 fixed top-[10vh] right-[20px] bg-white p-[5px] rounded-[10px]'}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 100 100">
          <path
            fill="currentColor"
            d="M50.001 0C33.65 0 20.25 13.36 20.25 29.666c0 6.318 2.018 12.19 5.433 17.016L46.37 82.445c2.897 3.785 4.823 3.066 7.232-.2l22.818-38.83c.46-.834.822-1.722 1.137-2.629a29.28 29.28 0 0 0 2.192-11.12C79.75 13.36 66.354 0 50.001 0m0 13.9c8.806 0 15.808 6.986 15.808 15.766c0 8.78-7.002 15.763-15.808 15.763c-8.805 0-15.81-6.982-15.81-15.763c0-8.78 7.005-15.765 15.81-15.765"
          />
          <path
            fill="currentColor"
            d="m68.913 48.908l-.048.126c.015-.038.027-.077.042-.115zm-5.065 24.446l-1.383 1.71c1.87.226 3.68.491 5.375.812l-5.479 1.623l7.313 1.945l5.451-1.719c3.348 1.123 7.984 2.496 9.52 4.057h-10.93l1.086 3.176h11.342c-.034 1.79-3.234 3.244-6.29 4.422l-7.751-1.676l-7.303 2.617l7.8 1.78c-4.554 1.24-12.2 1.994-18.53 2.341l-.266-3.64h-7.606l-.267 3.64c-6.33-.347-13.975-1.1-18.53-2.34l7.801-1.781l-7.303-2.617l-7.752 1.676c-3.012-.915-6.255-2.632-6.289-4.422H25.2l1.086-3.176h-10.93c1.536-1.561 6.172-2.934 9.52-4.057l5.451 1.719l7.313-1.945l-5.479-1.623a82.552 82.552 0 0 1 5.336-.807l-1.363-1.713c-14.785 1.537-27.073 4.81-30.295 9.979C.7 91.573 19.658 99.86 49.37 99.989c.442.022.878.006 1.29 0c29.695-.136 48.636-8.42 43.501-16.654c-3.224-5.171-15.52-8.445-30.314-9.981"
            color="currentColor"
          />
        </svg>
      </div>
      <div
        onMouseDown={handleZoomInMouseDown}
        onMouseUp={handleZoomMouseUp}
        className={'cursor-pointer z-50 fixed top-[15vh] right-[20px] bg-white p-[5px] rounded-[10px]'}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="m18.031 16.617l4.283 4.282l-1.415 1.415l-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9s9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617m-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.867-3.133-7-7-7s-7 3.133-7 7s3.133 7 7 7a6.977 6.977 0 0 0 4.875-1.975zM10 10V7h2v3h3v2h-3v3h-2v-3H7v-2z"
          />
        </svg>
      </div>
      <div
        onMouseDown={handleZoomOutMouseDown}
        onMouseUp={handleZoomMouseUp}
        className={'cursor-pointer z-50 fixed top-[20vh] right-[20px] bg-white p-[5px] rounded-[10px]'}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="m18.031 16.617l4.283 4.282l-1.415 1.415l-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9s9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617m-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.867-3.133-7-7-7s-7 3.133-7 7s3.133 7 7 7a6.977 6.977 0 0 0 4.875-1.975zM7 10h8v2H7z"
          />
        </svg>
      </div>
      <div className={'absolute z-[1000]'}>
        {modalToShow ? React.createElement(modalToShow.getReactView().type, modalToShow.getReactView().props) : null}
      </div>
      <BabylonScene babylonMainView={presenter.babylonView} />
    </div>
  );
};

export { ModalType, GameView };
