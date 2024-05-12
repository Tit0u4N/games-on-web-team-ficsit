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

export enum State {
  ROLL_DICE,
  CARDS_CHOICE,
  MESSAGE,
}

export interface TrainingCenterLayoutState {
  state: State;
  diceResult: number | null;
  selectedCharacter: Character | null;
  choiceSelected: TrainingChoice | null;
  messageContent: string;
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
  const [, setMessageContent] = useState<string>('');

  const handleCharacterSelect = (character: Character) => {
    setDiceResult(null);
    setShowChoices(false);
    setSelectedCharacter(character);
    setChoiceSelected(null);
    setShowConfirm(false);
    setShowMessage(false);
  };

  const handleTrainingChoiceCards = (state: TrainingCenterLayoutState, character: Character, choice: TrainingChoice) => {
    setDiceResult(state.diceResult!);
    setShowChoices(true);
    setSelectedCharacter(character);
    setChoiceSelected(choice);
    setShowConfirm(false);
    setShowMessage(false);
    setShowConfirm(!!choice);
  };

  const handleDiceRollEnd = (character: Character, result: number) => {
    trainingCenter.dicePresenter.unMountView();
    setHideModal(false);
    setDiceResult(result);
    setShowChoices(true);
    const newState = {
      state: State.CARDS_CHOICE,
      diceResult: result!,
      selectedCharacter: selectedCharacter!,
      choiceSelected: null,
      messageContent: '',
    };
    trainingCenter.updateState(selectedCharacter!, newState);
  };

  const handleDiceRollStart = () => {
    setIsRolling(true);
    setHideModal(true);
  };

  const getReactElementFromCurrentState = (character: Character | null) => {
    if (character == null) return null;
    console.log('character: ', character);
    const state = trainingCenter.getState(character);
    console.log('state: ', state);
    switch (state?.state) {
      case State.ROLL_DICE:
        console.log('state.ROLL_DICE');
        return <DiceComponent
          className={`w-[100%] mt-auto flex items-center justify-around p-5 rounded-[20px] shadow ml-auto ${showChoices ? 'hidden' : ''}`}
          dicePresenter={trainingCenter.dicePresenter}
          onRoll3DStart={handleDiceRollStart}
          onRoll3DEnd={(value: number | undefined) => {
            handleDiceRollEnd(character, value!);
          }}
        />;
      case State.CARDS_CHOICE:
        console.log('state.CARDS_CHOICE');
        return <TrainingChoiceCards
          diceResult={state.diceResult!}
          trainingCenter={trainingCenter}
          onChoiceSelected={(choice) => {
            handleTrainingChoiceCards(state, character, choice);
          }}
          character={state.selectedCharacter!}
          choiceSelected={state.choiceSelected}
        />;
      case State.MESSAGE:
        console.log('state.MESSAGE');
        return <Card className="w-full m-auto text-center p-10">
          <ModalHeader className="flex flex-col gap-1">Currently in training</ModalHeader>
          <CardBody className={'text-center'}>
            <p>{state.messageContent}</p>
          </CardBody>
        </Card>;
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen && !hideModal} onClose={onClose} className="h-[80%] w-[80%] max-w-full">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Training Center</ModalHeader>
        <ModalBody className="flex flex-row justify-between py-6 h-[85%]">
          <div className={'flex flex-col w-[600px]'}>
            {trainingCenter.charactersInside.map((character: Character) => (
              <ClickableCard
                key={character.id}
                trainingCenter={trainingCenter}
                choice={choiceSelected}
                character={character}
                isSelected={selectedCharacter === character}
                onSelect={() => {
                  handleCharacterSelect(character);
                }}
              />
            ))}
          </div>
          <div
            className={`flex flex-col justify-between ${(showMessage || diceResult == null) ? 'w-full' : ''}  ${diceResult == null ? 'mt-auto' : ''}`}>
            {
              getReactElementFromCurrentState(selectedCharacter)
            }
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
              const newState = {
                state: State.MESSAGE,
                diceResult: diceResult,
                selectedCharacter: selectedCharacter!,
                choiceSelected: choiceSelected,
                messageContent: message,
              };
              trainingCenter.updateState(selectedCharacter!, newState);
            }}>
              Confirm
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
