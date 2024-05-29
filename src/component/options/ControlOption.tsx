import React from 'react';
import { OptionLayout } from './OptionLayout';

type ControlProps = {
  title: string;
  description: string;
  option: string;
  defaultValue: string;
};

export const ControlOption: React.FC<ControlProps> = ({ title, description, option, defaultValue }) => {
  const [value, setValue] = React.useState(defaultValue);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // Validate input length
    if (inputValue.length == 1) {
      setValue(inputValue);
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
