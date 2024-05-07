import React from 'react';
import { Switch } from '@nextui-org/react';
import { GameOptions } from '@/core/GameOptions.ts';

type Props = {
  option: string;
  title: string;
  description: string;
};

export const SwitchOption: React.FC<Props> = ({ option, title, description = '' }) => {
  const [isSwitchOn, setIsSwitchOn] = React.useState(GameOptions.instance.get(option) as boolean);

  const toggleSwitch = (force?: boolean) => {
    if (force == undefined) force = !isSwitchOn;
    setIsSwitchOn(force);
    GameOptions.instance.set(option, force);
  };

  return (
    <div className={'w-full flex justify-between aline-center'} onClick={() => toggleSwitch()}>
      <div>
        <h3 className={'text-l'}>{title}</h3>
        <p className={'m-0 text-sm text-gray-400'}>{description}</p>
      </div>
      <Switch isSelected={isSwitchOn} onValueChange={toggleSwitch} />
    </div>
  );
};
