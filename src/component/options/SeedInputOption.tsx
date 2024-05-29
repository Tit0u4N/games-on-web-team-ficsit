import React, { useState, useEffect } from 'react';
import { Input } from '@nextui-org/react';
import { config } from '@core/Interfaces.ts';

interface SeedInputOptionProps {
  title: string;
  description: string;
  option: string;
}

export const SeedInputOption: React.FC<SeedInputOptionProps> = ({ title, description, option }) => {
  const [value, setValue] = useState<string | null>(config.map.view.mapPresenter.defaultOptions.seed);

  useEffect(() => {
    // Update the config when value changes
    config.map.view.mapPresenter.defaultOptions.seed = value;
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className={'flex flex-col mb-4'}>
      <label className={'block text-lg font-medium mb-2'}>{title}</label>
      <span className={'text-sm text-gray-500 mb-2'}>{description}</span>
      <Input
        type={'text'}
        maxLength={24}
        value={value?.toString() || ''}
        onChange={handleChange}
        placeholder={'Enter seed value'}
        aria-label={title}
      />
    </div>
  );
};
