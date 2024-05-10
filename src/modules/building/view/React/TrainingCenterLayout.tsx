import { Button, Card, CardBody, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React, { useState } from 'react';
import { TrainingCenterModel } from '../../model/TrainingCenterModel.ts';
import { Character } from '../../../character/model/Character.ts';
import { ClickableCard } from './trainingCenter/ClickableCard.tsx';
import { TrainingChoice, TrainingChoiceCards } from './trainingCenter/TrainingChoiceCards.tsx';
import { DiceComponent } from '../../../dice/view/React/DiceComponent.tsx';

export interface TrainingCenterLayoutProps {
  trainingCenter: TrainingCenterModel;
  isOpen: boolean;
  onClose: () => void;
}

export const TrainingCenterLayout: React.FC<TrainingCenterLayoutProps> = ({ trainingCenter, isOpen, onClose }) => {
  const [hideModal, setHideModal] = useState<boolean>(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [showChoices, setShowChoices] = useState<boolean>(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [, setIsRolling] = useState(false);
  const [choiceSelected, setChoiceSelected] = useState<TrainingChoice | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [messageContent, setMessageContent] = useState<string>('');

  const handleDiceRollEnd = (result: number) => {
    trainingCenter.dicePresenter.unMountView();
    setHideModal(false);
    setDiceResult(result);
    setShowChoices(true);
  };

  const handleDiceRollStart = () => {
    setIsRolling(true);
    setHideModal(true);
  };

  return (
    <Modal isOpen={isOpen && !hideModal} onClose={onClose} className="h-[80%] w-[80%] max-w-full">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Training Center</ModalHeader>
        <ModalBody className="flex flex-row justify-between py-6 h-[85%]">
          <div className={'flex flex-col w-[600px]'}>
            {trainingCenter.charactersInside.map((character) => (
              <ClickableCard
                key={character.id}
                trainingCenter={trainingCenter}
                choice={choiceSelected}
                character={character}
                isSelected={selectedCharacter === character}
                onSelect={() => {
                  setSelectedCharacter(character);
                }}
              />
            ))}
          </div>
          <div className={`flex flex-col justify-between ${(showMessage || diceResult == null) ? 'w-full' : ''}  ${diceResult == null ? 'mt-auto' : ''}`}>
            {showMessage && (
              <Card className="w-full m-auto text-center p-10">
                <ModalHeader className="flex flex-col gap-1">Currently in training</ModalHeader>
                <CardBody className={'text-center'}>
                  <p>{messageContent}</p>
                </CardBody>
              </Card>
            )}
            {showChoices && selectedCharacter && (
              <TrainingChoiceCards
                diceResult={diceResult}
                trainingCenter={trainingCenter}
                onChoiceSelected={(choice) => {
                  setChoiceSelected(choice);
                  setShowConfirm(true);
                }}
                character={selectedCharacter}
                choiceSelected={choiceSelected}
              />
            )}
            {selectedCharacter && !showMessage && (
              <DiceComponent
                className={`w-[100%] mt-auto flex items-center justify-around p-5 rounded-[20px] shadow ml-auto ${showChoices ? 'hidden' : ''}`}
                dicePresenter={trainingCenter.dicePresenter}
                onRoll3DStart={handleDiceRollStart}
                onRoll3DEnd={(value: number | undefined) => {
                  handleDiceRollEnd(value!);
                }}
              />
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
            Close
          </Button>
          {showConfirm && (
            <Button color="primary" onClick={() => {
              setShowChoices(false);
              const rounds = choiceSelected?.rounds;
              const stats = choiceSelected?.stats;
              const message = `Your character will be training for ${rounds} rounds and will gain ${stats} stats.`;
              setMessageContent(message);
              setShowMessage(true);
              trainingCenter.getEffect(selectedCharacter!, choiceSelected!);
              setShowConfirm(false);
            }}>
              Confirm
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
