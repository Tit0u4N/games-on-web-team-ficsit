import React, { useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Kbd } from '@nextui-org/react';
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

  const gameSummaryParagraphs = config.event.view.rulesLayout.gameSummary;

  const [currentPage, setCurrentPage] = useState(0);
  const rulesPerPage = 1;

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % Math.ceil(config.rules.length / rulesPerPage));
  };

  const handlePreviousPage = () => {
    setCurrentPage(
      (prevPage) =>
        (prevPage - 1 + Math.ceil(config.rules.length / rulesPerPage)) % Math.ceil(config.rules.length / rulesPerPage),
    );
  };

  const currentRules = config.rules.slice(currentPage * rulesPerPage, (currentPage + 1) * rulesPerPage);

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
            'w-[30%] max-w-full fixed left-0 bg-background/90 backdrop-blur-xl z-30 p-4 rounded-r-lg mt-[4rem] h-[calc(100%-4rem)] flex flex-col gap-2 justify-between shadow-lg'
          }>
          <div className="flex flex-col overflow-y-auto max-h-[90%] p-4">
            {/* Game Summary Card */}
            <div className="flex flex-col justify-center my-2">
              <Card className="max-w-[550px]">
                <CardHeader className="flex gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 1696 1536"
                    className="rounded-sm">
                    <path
                      fill="currentColor"
                      d="M1671 350q40 57 18 129l-275 906q-19 64-76.5 107.5T1215 1536H292q-77 0-148.5-53.5T44 1351q-24-67-2-127q0-4 3-27t4-37q1-8-3-21.5t-3-19.5q2-11 8-21t16.5-23.5T84 1051q23-38 45-91.5t30-91.5q3-10 .5-30t-.5-28q3-11 17-28t17-23q21-36 42-92t25-90q1-9-2.5-32t.5-28q4-13 22-30.5t22-22.5q19-26 42.5-84.5T372 283q1-8-3-25.5t-2-26.5q2-8 9-18t18-23t17-21q8-12 16.5-30.5t15-35t16-36t19.5-32T504.5 12t36-11.5T588 6l-1 3q38-9 51-9h761q74 0 114 56t18 130l-274 906q-36 119-71.5 153.5T1057 1280H188q-27 0-38 15q-11 16-1 43q24 70 144 70h923q29 0 56-15.5t35-41.5l300-987q7-22 5-57q38 15 59 43m-1064 2q-4 13 2 22.5t20 9.5h608q13 0 25.5-9.5T1279 352l21-64q4-13-2-22.5t-20-9.5H670q-13 0-25.5 9.5T628 288zm-83 256q-4 13 2 22.5t20 9.5h608q13 0 25.5-9.5T1196 608l21-64q4-13-2-22.5t-20-9.5H587q-13 0-25.5 9.5T545 544z"
                    />
                  </svg>

                  <div className="flex flex-col">
                    <p className="text-xl font-semibold">Game Summary</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  {gameSummaryParagraphs.map((paragraph, index) => (
                    <p key={index} className={'mb-5'}>
                      {paragraph}
                    </p>
                  ))}
                </CardBody>
                <Divider />
              </Card>
            </div>
            {/* User Controls Card */}
            <div className="flex flex-col justify-center my-2">
              <Card className="max-w-[550px]">
                <CardHeader className="flex gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 16 16">
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M14 3H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1m0 8H3V4h11zm-3-6h-1v1h1zm-1 2H9v1h1zm2-2h1v1h-1zm1 4h-1v1h1zM6 9h5v1H6zm7-2h-2v1h2zM8 5h1v1H8zm0 2H7v1h1zM4 9h1v1H4zm0-4h1v1H4zm3 0H6v1h1zM4 7h2v1H4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex flex-col">
                    <p className="text-xl font-semibold">User Controls</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p>Here are the details of the controls that the user has set:</p>
                  <p className="text-sm text-gray-500 mt-2 mb-2">
                    The following keys correspond to the control actions:
                  </p>
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
              <Card className="max-w-[550px]">
                <CardHeader className="flex gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 512 512">
                    <path
                      fill="currentColor"
                      d="M202.24 74C166.11 56.75 115.61 48.3 48 48a31.36 31.36 0 0 0-17.92 5.33A32 32 0 0 0 16 79.9V366c0 19.34 13.76 33.93 32 33.93c71.07 0 142.36 6.64 185.06 47a4.11 4.11 0 0 0 6.94-3V106.82a15.9 15.9 0 0 0-5.46-12A143 143 0 0 0 202.24 74m279.68-20.7A31.33 31.33 0 0 0 464 48c-67.61.3-118.11 8.71-154.24 26a143.3 143.3 0 0 0-32.31 20.78a15.93 15.93 0 0 0-5.45 12v337.13a3.93 3.93 0 0 0 6.68 2.81c25.67-25.5 70.72-46.82 185.36-46.81a32 32 0 0 0 32-32v-288a32 32 0 0 0-14.12-26.61"
                    />
                  </svg>
                  <div className="flex flex-col">
                    <p className="text-xl font-semibold">Rules Pagination</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  {currentRules.map((rule, index) => (
                    <div key={index} className="flex flex-col gap-2 mt-2">
                      <p className="font-semibold">{rule.title}</p>
                      <p>{rule.content}</p>
                    </div>
                  ))}
                </CardBody>
                <Divider />
                <CardFooter className={'flex justify-center items-center w-full'}>
                  <div className="flex justify-between items-center w-full">
                    <Button disabled={currentPage === 0} onPress={handlePreviousPage}>
                      Previous
                    </Button>
                    <span>
                      {currentPage + 1} / {Math.ceil(config.rules.length / rulesPerPage)}
                    </span>
                    <Button disabled={(currentPage + 1) * rulesPerPage >= config.rules.length} onPress={handleNextPage}>
                      Next
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
          <div className={'bottom-0 p-4 flex justify-end'}>
            <Button color="danger" variant="light" onPress={handleClose}>
              Close
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
        <div className={'flex w-full justify-center'}>
          <Kbd keys={[]}>{config.arcRotateCameraKeyboardInputs.controls.keys.keysUp[0].toUpperCase()}</Kbd>
        </div>
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
      <span className={'text-gray-700 mr-2'}>Zoom :</span>
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
