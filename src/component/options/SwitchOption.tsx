import React from 'react';
import { Switch } from '@nextui-org/react';

type Props = {
  value: boolean;
  title: string;
  description: string;
};

export const SwitchOption: React.FC<Props> = ({ value, title, description = '' }) => {
  const [isSwitchOn, setIsSwitchOn] = React.useState(value);

  const toggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    value = !value;
  };

  return (
    <div className={'w-full flex justify-between aline-center'} onClick={toggleSwitch}>
      <div>
        <h3 className={'text-l'}>{title}</h3>
        <p className={'m-0 text-sm text-gray-400'}>{description}</p>
      </div>
      <Switch readOnly isSelected={isSwitchOn} />
    </div>
  );
};
