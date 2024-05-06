import { Button, Card, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React, { useState } from 'react';
import { TrainingCenterModel } from '../../model/TrainingCenterModel.ts';
import { DiceComponent } from '../../../dice/view/React/DiceComponent.tsx';

export interface TrainingCenterLayoutProps {
  trainingCenter: TrainingCenterModel;
  isOpen: boolean;
  onClose: () => void;
}

export const TrainingCenterLayout: React.FC<TrainingCenterLayoutProps> = ({ trainingCenter, isOpen, onClose }) => {
  const [isStatsRolling, setIsStatsRolling] = useState(false);
  const [isRoundRolling, setIsRoundRolling] = useState(false);
  const [hideModal, setHideModal] = React.useState<boolean>(false);
  return (
    <Modal isOpen={isOpen && !hideModal} onClose={onClose} className="h-[80%] w-[80%] max-w-full" onClick={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Training Center</ModalHeader>
        <ModalBody className="flex flex-row justify-between py-6 h-[80%]">
          <Card radius={'lg'} className={'flex flex-col gap-1 w-[380px] p-2'}>
            <div className="w-full h-[300px]">
              <div className="flex justify-between p-[10px] h-full w-full">
                <div className="flex flex-col w-1/5 gap-1"></div>
                <Divider orientation={'vertical'} />
                <div className="w-[75%] h-full flex rounded-xl bg-case"></div>
              </div>
            </div>
            <Divider />
            <div className="w-full h-[300px] justify-center">
              <div className="grid grid-cols-5 gap-1 p-[10px]"></div>
            </div>
          </Card>
          {!isStatsRolling && (
            <DiceComponent
              className={'w-full p-2 flex items-center justify-around'}
              dicePresenter={trainingCenter.diceStatsPresenter}
              onRoll3DStart={() => {
                setHideModal(true);
                setIsStatsRolling(true);
              }}
              onRoll3DEnd={() => {
                setHideModal(false);
                trainingCenter.diceStatsPresenter.unMountView();
              }}
            />
          )}
          {!isRoundRolling && (
            <DiceComponent
              className={'w-full p-2 flex items-center justify-around'}
              dicePresenter={trainingCenter.diceRoundPresenter}
              onRoll3DStart={() => {
                setHideModal(true);
                setIsRoundRolling(true);
              }}
              onRoll3DEnd={() => {
                setHideModal(false);
                trainingCenter.diceRoundPresenter.unMountView();
              }}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
            Close
          </Button>
          <Button color="primary">Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
