import React, { useState } from 'react';
import { Select, SelectItem, Selection } from '@nextui-org/react';
import { GameOptions } from '@/core/GameOptions.ts';
import { OptionLayout } from './OptionLayout.tsx';

type Props = {
  title: string;
  description: string;
  option: string;
};

export const SelectOption: React.FC<Props> = ({ title, description = '', option }) => {
  const options = [
    { key: 'low', label: 'Low' },
    { key: 'medium', label: 'Medium' },
    { key: 'high', label: 'High' },
    { key: 'ultra', label: 'Ultra' },
  ];

  //@ts-ignore
  const defaultValue = GameOptions.instance.get(option).level;
  const [value, setValue] = useState<Selection>(new Set([defaultValue]));

  const handleSelectionChange = (keys: Selection) => {
    setValue(keys);
    GameOptions.instance.set(option, [...keys][0] as string);
  };

  return (
    <OptionLayout title={title} description={description}>
      <Select
        className={'w-1/4'}
        onSelectionChange={handleSelectionChange}
        selectedKeys={value}
        aria-label={`Select ${title}`}>
        {options.map((key) => (
          <SelectItem key={key.key} value={key.key}>
            {key.label}
          </SelectItem>
        ))}
      </Select>
    </OptionLayout>
  );
};
