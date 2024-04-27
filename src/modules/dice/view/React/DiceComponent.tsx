import React, { useState } from 'react';
import { Button, Card, Checkbox } from '@nextui-org/react';
import { DicePresenter } from '../../presenter/DicePresenter.ts';
import { DiceModel } from '../../model/DiceModel.ts';

export interface DiceComponentProps {
  dicePresenter: DicePresenter;
  diceValues?: number[];
  className?: string;
  onRoll3DStart?: () => void;
  onRoll3DEnd?: () => void;
}

export const DiceComponent: React.FC<DiceComponentProps> = ({
  dicePresenter,
  className = '',
  onRoll3DStart = () => {},
  onRoll3DEnd = () => {},
}) => {
  const diceValues = DiceModel.initDiceValues();
  const [value, setValue] = useState(diceValues[0]);
  const [rollDice2DIsHidden, setRollDice2DIsHidden] = useState(true);
  const [rollDice2DCanClose, setRollDice2DCanClose] = useState(false);
  const [rollFinished, setRollFinished] = useState(false);

  async function rollDice(finalValue: number, nbRolls: number = 30) {
    setRollDice2DIsHidden(false);
    await simulateRoll(finalValue, setValue, nbRolls);
    setValue(finalValue);
    setRollDice2DCanClose(true);
    setRollFinished(true);
  }

  dicePresenter.RollDiceFunc2D = rollDice;
  dicePresenter.onRoll3DStart = onRoll3DStart;
  dicePresenter.onRoll3DEnd = onRoll3DEnd;

  return (
    <div className="w-full">
      <div className={className}>
        <Checkbox className={"block"} disabled={rollFinished} onChange={() => dicePresenter.toggle3DMod()} defaultSelected={true}>
          3D Dice
        </Checkbox>

        <Button
          color={'primary'}
          variant={'flat'}
          disabled={rollFinished || false}
          onClick={() => dicePresenter.rollDice()}>
          Launch
        </Button>
      </div>
      {rollDice2DIsHidden ? null : (
        <div
          className={'absolute w-[100vw] h-[100vh] flex justify-center items-center inset-0 select-none'}
          onClick={() => {
            if (rollDice2DCanClose) setRollDice2DIsHidden(true);
          }}>
          <Card className={'size-[150px] flex justify-center items-center'}>
            <div className={'text-6xl text-center text-black '}>{value}</div>
          </Card>
        </div>
      )}
    </div>
  );
};

export const simulateRoll = async (finalValue: number, setValue : (value : number) => void, nbRolls: number = 30) => {
  const diceValues = DiceModel.initDiceValues();
  let i = 0;
  for (i = nbRolls + 1; i >= 0; i--) {
    let interval = 75;
    if (i < 5) {
      interval = 75 + (5 - i) * 50;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
    setValue(diceValues[Math.floor(Math.random() * diceValues.length)]);
  }
  setValue(finalValue);
}