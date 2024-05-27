import React, { useState, useEffect } from 'react';
import { Slider } from '@nextui-org/react';
import { config } from '@/core/Interfaces.ts';

interface MapSizeOptionProps {
  title: string;
  description: string;
  option: string;
  min: number;
  max: number;
}

export const MapSizeOption: React.FC<MapSizeOptionProps> = ({ title, description, option, min, max }) => {
  const [value, setValue] = useState<number>(Math.max(config.map.view.mapPresenter.defaultOptions.size, min));

  useEffect(() => {
    // Update the config when value changes
    config.map.view.mapPresenter.defaultOptions.size = value;
  }, [value]);

  const handleChange = (newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setValue(newValue[0]);
    } else {
      setValue(newValue);
    }
  };

  return (
    <div className={'flex flex-col mb-4'}>
      <label className={'block text-lg font-medium mb-2'}>{title}</label>
      <span className={'text-sm text-gray-500 mb-2'}>{description}</span>
      <Slider
        minValue={20}
        maxValue={100}
        value={value}
        onChange={handleChange}
        aria-label={title}
      />
      <div className="flex justify-between text-sm text-gray-600">
        <span>{min}</span>
        <span>{value}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};
