import React from 'react';
import { Character } from '@character/model/Character.ts';
import { config } from '@core/Interfaces.ts';
import { TrainingCenterModel } from '../../../model/TrainingCenterModel.ts';
import { TrainingChoiceCard } from './TrainingChoiceCard.tsx';
import { XpManager } from '@core/singleton/XpManager.ts';

export type TrainingChoice = {
  label: string;
  stats: number;
  rounds: number;
  image: string;
  injuredRisk: number;
};

interface Props {
  diceResult: number | null;
  trainingCenter: TrainingCenterModel;
  onChoiceSelected: (choice: TrainingChoice) => void;
  character: Character;
  choiceSelected: TrainingChoice | null;
}

export const TrainingChoiceCards: React.FC<Props> = ({
  diceResult,
  trainingCenter,
  onChoiceSelected,
  choiceSelected,
}) => {
  if (diceResult === null) {
    return null;
  }

  const getChoices = (diceResult: number): TrainingChoice[] => {
    let choices;

    if (diceResult <= 7) {
      // Small number
      choices = config.building.view.trainingCenter.trainingChoices.userChoices.lowDiceScore;
    } else if (diceResult <= 17) {
      // Medium number
      choices = config.building.view.trainingCenter.trainingChoices.userChoices.mediumDiceScore;
    } else {
      // Good number
      choices = config.building.view.trainingCenter.trainingChoices.userChoices.highDiceScore;
    }

    // Map over the choices from the config, and add the injuredRisk
    return choices.map((choice: any) => ({
      label: choice.label,
      stats: XpManager.getInstance().gainXp(choice.stats),
      rounds: choice.rounds,
      image: choice.image,
      injuredRisk: calculateInjuryRisk(diceResult, choice.rounds),
    }));
  };

  const choices = getChoices(diceResult);
  return (
    <div
      className="flex flex-row justify-between items-center gap-4 w-full h-[100%] px-3 py-6 overflow-x-auto"
      id={'TrainingCardsChoices'}>
      {choices.map((choice, index) => (
        <div
          key={index}
          onClick={() => onChoiceSelected(choice)}
          className={'w-[280px] h-[100%]'}
          id={'TrainingChoices'}>
          <TrainingChoiceCard
            choice={choice}
            isSelected={choiceSelected?.label === choice.label}
            trainingCenter={trainingCenter}
          />
        </div>
      ))}
    </div>
  );
};

function calculateInjuryRisk(diceScore: number, rounds: number): number {
  const baseRisk = 0.1; // Base risk of injury
  const diceScoreFactor = (20 - diceScore) / 20; // Factor based on the dice score (worse roll = higher risk)
  const roundsFactor = rounds / 10; // Factor based on the number of rounds (more rounds = higher risk)
  const result = baseRisk + diceScoreFactor * roundsFactor;
  // round to 2 decimal places
  return Math.round(result * 100) / 100;
}
