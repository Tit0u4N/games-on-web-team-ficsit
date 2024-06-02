import React, { useState } from 'react';
import { Button, Card, Checkbox } from '@nextui-org/react';
import { DicePresenter } from '@dice/presenter/DicePresenter.ts';
import { DiceModel } from '@dice/model/DiceModel.ts';

export interface DiceComponentProps {
  dicePresenter: DicePresenter;
  diceValues?: number[];
  className?: string;
  onRoll3DStart?: () => void;
  onRoll3DEnd?: () => void;
  handleDiceValue?: (value: number) => void;
  onRoll2DEnd?: () => void;
  isDisabled?: boolean;
}

export const DiceComponent: React.FC<DiceComponentProps> = ({
  dicePresenter,
  className = '',
  onRoll3DStart = () => {},
  onRoll3DEnd = () => {},
  onRoll2DEnd = () => {},
  isDisabled = false,
  handleDiceValue,
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
  if (handleDiceValue) dicePresenter.handleDiceValue = handleDiceValue;

  const [is3DMod, setIs3DMod] = useState(dicePresenter.is3DMod);
  dicePresenter.on3DModChange.push((is3DMod: boolean) => {
    setIs3DMod(is3DMod);
  });

  return (
    <div className="w-full" id={"LaunchDiceTraining"}>
      <div className={className}>
        <Checkbox
          className={'block'}
          disabled={rollFinished || isDisabled}
          onChange={() => dicePresenter.toggle3DMod()}
          isSelected={is3DMod}
          defaultSelected={is3DMod}>
          3D Dice
        </Checkbox>

        <Button
          color={'primary'}
          variant={'flat'}
          disabled={rollFinished || isDisabled}
          onClick={() => {
            dicePresenter.RollDiceFunc2D = rollDice;
            dicePresenter.onRoll3DStart = onRoll3DStart;
            dicePresenter.onRoll3DEnd = onRoll3DEnd;
            dicePresenter.rollDice();
          }}>
          Launch
        </Button>
      </div>
      {rollDice2DIsHidden ? null : (
        <div
          className={'fixed w-[100vw] h-[100vh] flex justify-center items-center inset-0 select-none'}
          style={{ zIndex: 1000 }}
          onClick={() => {
            if (rollDice2DCanClose) {
              onRoll2DEnd();
              setRollDice2DIsHidden(true);
            }
          }}>
          <div>
            <Card className={'size-[150px] flex justify-center items-center'}>
              <div className={'text-6xl text-center text-black '}>{value}</div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export const simulateRoll = async (finalValue: number, setValue: (value: number) => void, nbRolls: number = 30) => {
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
};
