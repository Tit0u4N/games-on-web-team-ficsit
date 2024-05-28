import React from 'react';
import { Button, Card, CardBody, CardHeader, Divider, Image, Kbd } from '@nextui-org/react';
import { ModalType } from '@gamecore/view/React/GameView.tsx';
import { AnimatePresence, motion } from 'framer-motion';
import { config } from '@core/Interfaces.ts';

export interface InventoryLayoutProps {
  toggleModal: (type: ModalType, isOpen: boolean) => void;
  isModalOpen: (type: ModalType) => boolean;
}

export const RulesLayout: React.FC<InventoryLayoutProps> = ({ toggleModal, isModalOpen }) => {
  const handleClose = () => {
    toggleModal(ModalType.RULES, !isModalOpen(ModalType.RULES));
  };

  const gameSummary = `
  Train characters over 48 turns (4 years) to compete in the JO. You control three characters with unique abilities. Movement across the map uses Movement Points (MP), which reset each turn.    
  Use Training Centers to improve stats and participate in Arenas to compete in tournaments, decided by rolling a twenty-sided die (d20). Winning grants equipment items that affect stats and vary by season. Combine items for greater bonuses.
  Each turn, move characters, train, or enter tournaments. Seasons impact training, tournaments, and equipment effectiveness. Strategic decisions throughout the game are crucial for success in the JO.
  `;

  const gameSummaryParagraphs = gameSummary.split('\n');

  return (
    <AnimatePresence>
      {isModalOpen(ModalType.RULES) && (
        <motion.div
          key="modal"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ ease: 'easeInOut', duration: 0.6 }}
          className={
            'w-[25%] max-w-full fixed left-0 bg-background/90 backdrop-blur-xl z-30 p-4 rounded-r-lg mt-[4rem] h-[calc(100%-4rem)] flex flex-col gap-2 justify-between shadow-lg'
          }>
          <div className="flex flex-col overflow-y-auto max-h-[90%] p-4">
            {/* Game Summary Card */}
            <div className="flex flex-col justify-center my-2">
              <Card className="max-w-[400px]">
                <CardHeader className="flex gap-3">
                  <Image
                    alt="game logo"
                    height={40}
                    radius="sm"
                    src="https://example.com/game-logo.png"
                    width={40}
                  />
                  <div className="flex flex-col">
                    <p className="text-md">Game Summary</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  {gameSummaryParagraphs.map((paragraph, index) => (
                    <p key={index} className={'mb-5'}>{paragraph}</p>
                  ))}
                </CardBody>
                <Divider />
              </Card>
            </div>
            {/* User Controls Card */}
            <div className="flex flex-col justify-center my-2">
              <Card className="max-w-[400px]">
                <CardHeader className="flex gap-3">
                  <Image
                    alt="controls logo"
                    height={40}
                    radius="sm"
                    src="https://example.com/controls-logo.png"
                    width={40}
                  />
                  <div className="flex flex-col">
                    <p className="text-md">User Controls</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p>Here are the details of the controls that the user has set:</p>
                  <p className="text-sm text-gray-500 mt-2 mb-2">The following keys correspond to the control actions:</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 mb-4">
                    <MoveOptions />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-2 mb-4">
                    <ZoomOptions />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-2 mb-4">
                    <ResetOptions />
                  </div>
                </CardBody>

                <Divider />
              </Card>
            </div>
            {/* Pagination Card */}
            <div className="flex flex-col justify-center my-2">
              <Card className="max-w-[400px]">
                <CardHeader className="flex gap-3">
                  <Image
                    alt="pagination logo"
                    height={40}
                    radius="sm"
                    src="https://example.com/pagination-logo.png"
                    width={40}
                  />
                  <div className="flex flex-col">
                    <p className="text-md">Rules Pagination</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p>Pagination controls for the remaining rules will go here.</p>
                </CardBody>
                <Divider />
              </Card>
            </div>
          </div>
          <div className={'bottom-0 p-4 flex justify-end'}>
            <Button color="danger" variant="light" onPress={handleClose}>
              Close
            </Button>
            <Button color="primary" onPress={handleClose}>
              Action
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


const MoveOptions = () => {
  return (
    <>
      <span className="text-gray-700 mr-2">Move :</span>
      <div className={'flex flex-col'}>
        <div className={'flex w-full justify-center'}>
          <Kbd keys={'up'}></Kbd>
        </div>
        <div className={'flex w-full justify-center'}>
          <Kbd keys={'left'}></Kbd>
          <Kbd keys={'down'}></Kbd>
          <Kbd keys={'right'}></Kbd>
        </div>
      </div>
      <div className={'flex flex-col'}>
        <div className={'flex w-full justify-center'}><Kbd
          keys={[]}>{config.arcRotateCameraKeyboardInputs.controls.keys.keysUp[0].toUpperCase()}</Kbd></div>
        <div className={'flex w-full justify-center'}>
          <Kbd keys={[]}>{config.arcRotateCameraKeyboardInputs.controls.keys.keysLeft[0].toUpperCase()}</Kbd>
          <Kbd keys={[]}>{config.arcRotateCameraKeyboardInputs.controls.keys.keysDown[0].toUpperCase()}</Kbd>
          <Kbd keys={[]}>{config.arcRotateCameraKeyboardInputs.controls.keys.keysRight[0].toUpperCase()}</Kbd>
        </div>
      </div>
    </>
  );
};

const ZoomOptions = () => {
  return (
    <>
      <span className={"text-gray-700 mr-2"}>Zoom :</span>
      <div>
        <div>
          <div className="flex items-center">
            <Kbd keys={[]}>{config.arcRotateCameraKeyboardInputs.controls.keys.keysZoomIn[0]}</Kbd>
            <Kbd keys={[]}>{config.arcRotateCameraKeyboardInputs.controls.keys.keysZoomOut[0]}</Kbd>
          </div>
        </div>
      </div>
    </>
  );
};

const ResetOptions = () => {
  return (
    <>
      <span className="text-gray-700 mr-2">Reset :</span>
      <div>
        <div>
          <div className="flex items-center">
            <Kbd keys={[]}>{config.arcRotateCameraKeyboardInputs.controls.keys.resetPosition[0].toUpperCase()}</Kbd>
          </div>
        </div>
      </div>
    </>
  );
};

export default RulesLayout;
