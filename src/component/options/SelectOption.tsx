import React, { useState } from 'react';
import { Select, SelectItem, Selection } from '@nextui-org/react';
import { GameOptions } from '../../core/GameOptions.ts';

type Props = {
  title: string;
  description: string;
  option: string;
};

export const SelectOption: React.FC<Props> = ({ title, description = '', option }) => {
  const selectOptions = [
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
    <div className={'w-full flex justify-between aline-center'}>
      <div>
        <h3 className={'text-l'}>{title}</h3>
        <p className={'m-0 text-sm text-gray-400'}>{description}</p>
      </div>
      <Select onSelectionChange={handleSelectionChange} selectedKeys={value}>
        {selectOptions.map((key) => (
          <SelectItem key={key.key} value={key.key}>
            {key.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};
