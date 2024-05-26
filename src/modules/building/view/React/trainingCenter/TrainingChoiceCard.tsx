import { TrainingCenterModel } from '../../../model/TrainingCenterModel.ts';
import React from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { TrainingChoice } from './TrainingChoiceCards.tsx';

interface TrainingChoiceCardProps {
  choice: TrainingChoice;
  isSelected: boolean;
  trainingCenter: TrainingCenterModel;
}

export const TrainingChoiceCard: React.FC<TrainingChoiceCardProps> = ({ choice, isSelected, trainingCenter }) => {
  const cardClassName = `w-full h-full ${isSelected ? 'opacity-100' : 'opacity-50'}`;
  return (
    <Card className={cardClassName}>
      <CardHeader className={'flex flex-col h-[50%]'}>
        <div className={'mb-[20px]'}>
          <img src={choice.image} alt={choice.label} className="w-full h-32 object-cover" />
        </div>
        <div className="text-center text-xl font-semibold mt-2">{choice.label}</div>
      </CardHeader>
      <CardBody className={'mt-[20px]'}>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Injury Risk</div>
          <div className="text-sm font-medium">{Math.floor(choice.injuredRisk * 100)}%</div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm font-medium">
            {trainingCenter.sports.map(
              (sport, index) => sport.name + (index !== trainingCenter.sports.length - 1 ? ' | ' : ''),
            )}
          </div>
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
