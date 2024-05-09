import { Button, Card, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React, { useState } from 'react';
import { TrainingCenterModel } from '../../model/TrainingCenterModel.ts';
import { DiceComponent } from '../../../dice/view/React/DiceComponent.tsx';
import { TrainingChoices } from './trainingCenter/TrainingChoices.tsx';
import { CharacterStats } from './trainingCenter/CharacterStats.tsx';

export interface TrainingCenterLayoutProps {
  trainingCenter: TrainingCenterModel;
  isOpen: boolean;
  onClose: () => void;
}

export const TrainingCenterLayout: React.FC<TrainingCenterLayoutProps> = ({ trainingCenter, isOpen, onClose }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [hideModal, setHideModal] = useState<boolean>(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [showChoices, setShowChoices] = useState<boolean>(false);

  const handleDiceRollEnd = (result: number) => {
    trainingCenter.dicePresenter.unMountView();
    setHideModal(false);
    setDiceResult(result);
    setShowChoices(true);
  };

  return (
    <Modal isOpen={isOpen && !hideModal} onClose={onClose} className="h-[80%] w-[80%] max-w-full">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Training Center</ModalHeader>
        <ModalBody className="flex flex-row justify-between py-6 h-[85%]">
          <div className={'flex flex-col w-full'}>
            {trainingCenter.charactersInside.map((character) => (
              <Card key={character.id} radius={'lg'} className={'flex flex-col gap-1 w-[600px] p-2 mt-4 mb-4'}>
                <CharacterStats character={character} />
              </Card>
            ))}
          </div>
          {!isRolling && (
            <DiceComponent
              className={'w-[50%] p-2 flex items-center justify-around'}
              dicePresenter={trainingCenter.dicePresenter}
              onRoll3DStart={() => {
                setHideModal(true);
                setIsRolling(true);
              }}
              onRoll3DEnd={() => {
                handleDiceRollEnd(12);
              }}
            />
          )}
          {showChoices && (
            <TrainingChoices
              diceResult={diceResult}
              onChoiceSelected={(choice) => {
                setShowChoices(false);
                trainingCenter.userChoice = choice;
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
