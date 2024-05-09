import React from 'react';
import { TrainingSelectOption } from './TrainingSelectOption.tsx';
import { config } from '../../../../../core/Interfaces.ts';

export type TrainingChoice = {
  label: string;
  stats: number;
  rounds: number;
  injuredRisk: number;
};

interface TrainingChoicesProps {
  diceResult: number | null;
  onChoiceSelected: (choice: TrainingChoice) => void;
}

export const TrainingChoices: React.FC<TrainingChoicesProps> = ({ diceResult, onChoiceSelected }) => {
  if (diceResult === null) {
    return null;
  }

  const getChoices = (diceResult: number): TrainingChoice[] => {
    let choices;

    if (diceResult <= 7) {
      // Small number
      choices = config.building.trainingCenterModel.userChoices.lowDiceScore;
    } else if (diceResult <= 17) {
      // Medium number
      choices = config.building.trainingCenterModel.userChoices.mediumDiceScore;
    } else {
      // Good number
      choices = config.building.trainingCenterModel.userChoices.highDiceScore;
    }

    // Map over the choices from the config, and add the injuredRisk
    return choices.map((choice: any) => ({
      label: choice.label,
      stats: choice.stats,
      rounds: choice.rounds,
      injuredRisk: calculateInjuryRisk(diceResult, choice.rounds),
    }));
  };


  const choices = getChoices(diceResult);

  return (
    <div className={'w-full'}>
      <TrainingSelectOption choices={choices} onSelectionChange={onChoiceSelected} />
    </div>
  );
};

function calculateInjuryRisk(diceScore: number, rounds: number): number {
  const baseRisk = 0.05; // Base risk of injury
  const diceScoreFactor = (20 - diceScore) / 20; // Factor based on the dice score (worse roll = higher risk)
  const roundsFactor = rounds / 10; // Factor based on the number of rounds (more rounds = higher risk)

  return baseRisk + diceScoreFactor * roundsFactor;
}
