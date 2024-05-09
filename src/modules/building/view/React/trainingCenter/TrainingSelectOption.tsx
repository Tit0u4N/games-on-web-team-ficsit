import React from 'react';
import { Select, SelectItem, Selection } from '@nextui-org/react';
import { TrainingChoice } from './TrainingChoices.tsx';

type Props = {
  choices: TrainingChoice[];
  onSelectionChange: (selectedChoice: TrainingChoice) => void;
};

export const TrainingSelectOption: React.FC<Props> = ({ choices, onSelectionChange }) => {
  const [value, setValue] = React.useState<Selection>(new Set());

  const handleSelectionChange = (keys: Selection) => {
    setValue(keys);
    const selectedChoice = choices.find((choice) => choice.label === [...keys][0]);
    if (selectedChoice) {
      onSelectionChange(selectedChoice);
    }
  };

  return (
    <Select
      className={'w-full'}
      onSelectionChange={handleSelectionChange}
      selectedKeys={value}
      aria-label={'Select Training Choice'}>
      {choices.map((choice) => (
        <SelectItem key={choice.label} value={choice.label}>
          {choice.label}
        </SelectItem>
      ))}
    </Select>
  );
};
