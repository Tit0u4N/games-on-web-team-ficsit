import {
  Button,
  Card,
  CardBody,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import React, { useState } from 'react';
import { TrainingCenterModel } from '../../model/TrainingCenterModel.ts';
import { Character } from '@character/model/Character.ts';
import { ClickableCard } from './trainingCenter/ClickableCard.tsx';
import { TrainingChoice, TrainingChoiceCards } from './trainingCenter/TrainingChoiceCards.tsx';
import { DiceComponent } from '@dice/view/React/DiceComponent.tsx';
import { Sport } from '@core/singleton/Sport.ts';

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
  const [, setShowMessage] = useState<boolean>(false);
  const [, setMessageContent] = useState<string>('');

  const handleCharacterSelect = (character: Character) => {
    setDiceResult(null);
    setShowChoices(false);
    setSelectedCharacter(character);
    setChoiceSelected(null);
    setShowConfirm(false);
    setShowMessage(false);
  };

  const handleTrainingChoiceCards = (
    state: TrainingCenterLayoutState,
    character: Character,
    choice: TrainingChoice,
  ) => {
    setDiceResult(state.diceResult!);
    setShowChoices(true);
    setSelectedCharacter(character);
    setChoiceSelected(choice);
    setShowMessage(false);
    setShowConfirm(!!choice);
  };

  const handleDiceValue = (value: number) => {
    selectedCharacter!.attributes.movement = 0;
    setDiceResult(value);
    setShowChoices(true);
    const newState = {
      state: State.CARDS_CHOICE,
      diceResult: value!,
      selectedCharacter: selectedCharacter!,
      choiceSelected: null,
      messageContent: '',
    };
    trainingCenter.updateState(selectedCharacter!, newState);
  };

  const handleDice3DEnd = () => {
    trainingCenter.dicePresenter.unMountView();
    setHideModal(false);
  };

  const handleDiceRollStart = () => {
    setIsRolling(true);
    setHideModal(true);
    selectedCharacter!.attributes.movement = 0;
  };

  const getReactElementFromCurrentState = (character: Character | null) => {
    if (character == null) return null;
    const state = trainingCenter.getState(character);
    switch (state?.state) {
      case State.ROLL_DICE:
        return (
          <DiceComponent
            className={`w-[100%] mt-auto flex items-center justify-around p-5 rounded-[20px] shadow ml-auto ${showChoices ? 'hidden' : ''}`}
            dicePresenter={trainingCenter.dicePresenter}
            onRoll3DStart={handleDiceRollStart}
            onRoll3DEnd={handleDice3DEnd}
            handleDiceValue={handleDiceValue}
          />
        );
      case State.CARDS_CHOICE:
        if (diceResult == null) handleTrainingChoiceCards(state, character, state.choiceSelected!);
        return (
          <TrainingChoiceCards
            diceResult={state.diceResult!}
            trainingCenter={trainingCenter}
            onChoiceSelected={(choice) => {
              handleTrainingChoiceCards(state, character, choice);
            }}
            character={state.selectedCharacter!}
            choiceSelected={choiceSelected}
          />
        );
      case State.MESSAGE:
        if (diceResult == null) handleTrainingChoiceCards(state, character, state.choiceSelected!);
        return (
          <Card className="w-full m-auto text-center p-10">
            <ModalHeader className="flex flex-col gap-1">Currently in training</ModalHeader>
            <CardBody className={'text-center'}>
              <p>{state.messageContent}</p>
            </CardBody>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen && !hideModal} onClose={onClose} className="h-[80%] w-[80%] max-w-full">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h1 className="text-2xl">Training Center</h1>
        </ModalHeader>
        <ModalBody className="flex flex-row justify-between py-6 h-[85%] overflow-y-auto">
          <div className={'flex flex-col w-[37%] min-w-[500px]'}>
            {trainingCenter.sports.length > 0 && (
              <>
                <div className="my-2">
                  <p>Sports:</p>
                  <div className="grid grid-cols-2">
                    {trainingCenter.sports.map((sport: Sport, index: number) => (
                      <div key={index} className="flex my-1">
                        <Image src={sport.iconPath} width={30} height={30} alt={sport.name} />
                        <span className="mx-2">{sport.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>Rounds before sports change: {trainingCenter.rotation}</div>
              </>
            )}
            {trainingCenter.charactersInside.map((character: Character) => (
              <ClickableCard
                key={character.id}
                trainingCenter={trainingCenter}
                choice={choiceSelected}
                character={character}
                selectecCharacter={selectedCharacter}
                isSelected={selectedCharacter === character}
                onSelect={() => {
                  handleCharacterSelect(character);
                }}
              />
            ))}
          </div>
          <div className="w-[63%]">{getReactElementFromCurrentState(selectedCharacter)}</div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
            Close
          </Button>
          {showConfirm && (
            <Button
              color="primary"
              onClick={() => {
                setShowChoices(false);
                const rounds = choiceSelected?.rounds;
                const stats = choiceSelected?.stats;
                const message = `Your character will be training for ${rounds} rounds and will gain ${stats} xp.`;
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
