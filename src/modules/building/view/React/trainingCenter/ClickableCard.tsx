import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { Character } from '../../../../character/model/Character.ts';
import { CharacterStats } from './CharacterStats.tsx';
import { TrainingChoice } from './TrainingChoiceCards.tsx';
import { TrainingCenterModel } from '../../../model/TrainingCenterModel.ts';

interface ClickableCardProps {
  character: Character;
  selectecCharacter: Character | null;
  trainingCenter: TrainingCenterModel;
  choice: TrainingChoice | null;
  isSelected: boolean;
  onSelect: () => void;
}

export const ClickableCard: React.FC<ClickableCardProps> = ({ character, selectecCharacter, trainingCenter, choice, isSelected, onSelect }) => {
  const cardClassName = `flex flex-col gap-1 w-[600px] p-2 mt-4 mb-4 ${
    isSelected ? 'opacity-100' : 'opacity-50'
  }`;

  return (
    <Card key={character.id} radius={'lg'} className={cardClassName}>
      <CardBody>
        <div onClick={onSelect} className="w-full h-full">
          <CharacterStats character={character} selectecCharacter={selectecCharacter} trainingCenter={trainingCenter} choice={choice} />
        </div>
      </CardBody>
    </Card>
  );
};
