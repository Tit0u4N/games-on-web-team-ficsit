import { TrainingCenterModel } from '../../../model/TrainingCenterModel.ts';
import React from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { TrainingChoice } from './TrainingChoiceCards.tsx';

interface TrainingChoiceCardProps {
  choice: TrainingChoice;
  isSelected: boolean;
  trainingCenter: TrainingCenterModel;
}

export const TrainingChoiceCard: React.FC<TrainingChoiceCardProps> = ({ choice, isSelected, trainingCenter}) => {
  const cardClassName = `w-full h-full ${isSelected ? 'opacity-100' : 'opacity-50'}`;
  return (
    <Card className={cardClassName}>
      <CardHeader className={'flex flex-col'}>
        {/* Replace this with the actual image component */}
        <div>
        <img src={choice.image} alt={choice.label} className="w-full h-32 object-cover" />
        </div>
        <div className="text-center text-xl font-semibold mt-2">{choice.label}</div>
      </CardHeader>
      <CardBody>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Injury Risk</div>
          <div className="text-sm font-medium">{choice.injuredRisk}%</div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm font-medium">{trainingCenter.sports.map(
            (sport) => sport.name + ' | ',
          )}</div>
          <div className="text-sm font-medium">{choice.stats}</div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm font-medium">Rounds</div>
          <div className="text-sm font-medium">{choice.rounds}</div>
        </div>
      </CardBody>
    </Card>
  );
};
