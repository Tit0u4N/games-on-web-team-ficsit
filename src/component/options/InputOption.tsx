import React from 'react';
import { OptionLayout } from './OptionLayout';
import { config } from '@/core/Interfaces';

type ControlProps = {
  title: string;
  description: string;
  option: string;
  defaultValue: string;
};

function getOptionConfig(option: string) {
  switch (option) {
    case 'moveForward':
      return config.arcRotateCameraKeyboardInputs.controls.keys.keysUp;
    case 'moveBackward':
      return config.arcRotateCameraKeyboardInputs.controls.keys.keysDown;
    case 'moveLeft':
      return config.arcRotateCameraKeyboardInputs.controls.keys.keysLeft;
    case 'moveRight':
      return config.arcRotateCameraKeyboardInputs.controls.keys.keysRight;
    case 'zoomIn':
      return config.arcRotateCameraKeyboardInputs.controls.keys.keysZoomIn;
    case 'zoomOut':
      return config.arcRotateCameraKeyboardInputs.controls.keys.keysZoomOut;
    case 'resetCamera':
      return config.arcRotateCameraKeyboardInputs.controls.keys.resetPosition;
    default:
      return [];
  }
}

export const ControlOption: React.FC<ControlProps> = ({ title, description, option, defaultValue }) => {
  const control = getOptionConfig(option);
  const [value, setValue] = React.useState(defaultValue);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // Validate input length
    if (inputValue.length <= 1) {
      setValue(inputValue);
      if (inputValue.length == 1) {
        control[0] = inputValue;
      }
    }
  };

  const inputClassName = `w-[50%] p-2 border border-gray-300 rounded text-center`;

  return (
    <OptionLayout title={title} description={description}>
      <div className={'flex flex-col items-end'}>
        <input type="text" value={value} onChange={handleInputChange} maxLength={1} className={inputClassName} />
      </div>
    </OptionLayout>
  );
};
