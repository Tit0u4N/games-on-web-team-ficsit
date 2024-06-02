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
import React, { useEffect, useState } from 'react';
import { TrainingCenterModel } from '../../model/TrainingCenterModel.ts';
import { Character } from '@character/model/Character.ts';
import { ClickableCard } from './trainingCenter/ClickableCard.tsx';
import { TrainingChoice, TrainingChoiceCards } from './trainingCenter/TrainingChoiceCards.tsx';
import { DiceComponent } from '@dice/view/React/DiceComponent.tsx';
import { Sport } from '@core/singleton/Sport.ts';
import HighlightTutorialSpeech from '@gamecore/view/React/narrator/HighlightTutorialSpeech.tsx';
import { config } from '@core/Interfaces.ts';
import { TrainingCenterPresenter } from '@building/presenter/TrainingCenterPresenter.ts';

export interface TrainingCenterLayoutProps {
  trainingCenterPresenter: TrainingCenterPresenter;
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

const LOCAL_STORAGE_KEY = 'activeNarrationStep';

export const TrainingCenterLayout: React.FC<TrainingCenterLayoutProps> = ({
  trainingCenterPresenter,
  trainingCenter,
  isOpen,
  onClose,
}) => {
  const [hideModal, setHideModal] = useState<boolean>(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [showChoices, setShowChoices] = useState<boolean>(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [, setIsRolling] = useState(false);
  const [choiceSelected, setChoiceSelected] = useState<TrainingChoice | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [, setMessageContent] = useState<string>('');
  const [activeNarrationStep, setActiveNarrationStep] = useState<number>(() => {
    return parseInt(localStorage.getItem(LOCAL_STORAGE_KEY) || '0', 10);
  });
  const [isNarrationVisible, setIsNarrationVisible] = useState<boolean>(false);

  const updateNarrationStep = () => {
    if (selectedCharacter == null || !config.narratorBox.enabled) return null;
    if (activeNarrationStep >= config.narratorBox.trainingCenterHighlightTutorialSpeech.length) return null;
    if (!trainingCenterPresenter.buildingPresenter.hasTrainingCenterShownNarratorBox && !isOpen) return null;
    const state = trainingCenter.getState(selectedCharacter);
    switch (state?.state) {
        case State.ROLL_DICE:
            if (activeNarrationStep !== 0) return null;
            setActiveNarrationStep(1);
            setIsNarrationVisible(true)
            break;
        case State.CARDS_CHOICE:
          if (activeNarrationStep !== 1) return null;
          setActiveNarrationStep(2);
          setIsNarrationVisible(true)
          break;
        case State.MESSAGE:
          if (activeNarrationStep !== 2) return null;
          setActiveNarrationStep(3);
          setIsNarrationVisible(true)
          break;
        default:
            return null;
    }
  }

  useEffect(() => {
    if (!config.narratorBox.enabled) return;
    if (activeNarrationStep === 0 && !trainingCenterPresenter.buildingPresenter.hasTrainingCenterShownNarratorBox && isOpen) {
      setActiveNarrationStep(activeNarrationStep);
      setIsNarrationVisible(true);
    }
  }, [isOpen]);

  useEffect(() => {
    // Check if narration step is completed and advance to the next step
    if (activeNarrationStep >= config.narratorBox.trainingCenterHighlightTutorialSpeech.length || !config.narratorBox.enabled) return;
    const handleNextStep = () => {
      if (selectedCharacter !== null && diceResult == null && activeNarrationStep === 0) {
        setActiveNarrationStep(activeNarrationStep + 1);
        setIsNarrationVisible(true);
      } else if (showChoices && activeNarrationStep === 1) {
        setActiveNarrationStep(activeNarrationStep + 1);
        setIsNarrationVisible(true);
      } else if (showMessage && activeNarrationStep === 2) {
        setActiveNarrationStep(activeNarrationStep + 1);
        setIsNarrationVisible(true);
      }
    };
    handleNextStep();
  }, [selectedCharacter, diceResult, showChoices, choiceSelected, showMessage, activeNarrationStep]);

  useEffect(() => {
    updateNarrationStep();
  }, [selectedCharacter, diceResult, showChoices, choiceSelected, showMessage]);

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

  const handleChoiceConfirm = (state: TrainingCenterLayoutState, character: Character) => {
    setDiceResult(state.diceResult!);
    setSelectedCharacter(character);
    setShowChoices(false);
    setShowMessage(true);
    setShowConfirm(false);
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
        if (diceResult == null) {
          handleChoiceConfirm(state, character);
        }
        return (
          <Card className="w-full m-auto text-center p-10" id={'RoundTrainingLeft'}>
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
    <>
      {activeNarrationStep < config.narratorBox.trainingCenterHighlightTutorialSpeech.length && isNarrationVisible && (
        <>
          <div className={'fixed inset-0 bg-opacity-70 z-[45] flex items-center justify-center'}></div>

          <HighlightTutorialSpeech
            steps={config.narratorBox.trainingCenterHighlightTutorialSpeech[activeNarrationStep].step}
            onComplete={() => {
              if (activeNarrationStep === config.narratorBox.trainingCenterHighlightTutorialSpeech.length - 1) {
                setActiveNarrationStep(0);
                localStorage.removeItem(LOCAL_STORAGE_KEY);
              }
              setIsNarrationVisible(false);
            }}
          />
        </>
      )}
      <Modal
        isOpen={isOpen && !hideModal}
        onClose={() => {
          if (isNarrationVisible) return;
          localStorage.setItem(LOCAL_STORAGE_KEY, (activeNarrationStep).toString());
          onClose();
        }}
        className="h-[80%] w-[80%] max-w-full">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h1 className="text-2xl">Training Center</h1>
          </ModalHeader>
          <ModalBody className="flex flex-row justify-between py-6 h-[85%] overflow-y-auto">
            <div className={'flex flex-col w-[37%] min-w-[500px]'} id={'AllAthletes'}>
              {trainingCenter.sports.length > 0 && (
                <>
                  <div className="my-2" id={'SportTraining'}>
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
                  <div id={'RoundTrainingBeforeChange'}>Rounds before sports change: {trainingCenter.rotation}</div>
                </>
              )}
              {trainingCenter.charactersInside.map((character: Character) => (
                <span id={'AthleteToTrain'}>
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
                </span>
              ))}
            </div>
            <div className="w-[63%]">{getReactElementFromCurrentState(selectedCharacter)}</div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onClick={()=> {
              if (isNarrationVisible) return;
              localStorage.setItem(LOCAL_STORAGE_KEY, (activeNarrationStep).toString());
              onClose()
            }}>
              Close
            </Button>
            {showConfirm && (
              <Button
                id={'ConfirmTraining'}
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
    </>
  );
};
