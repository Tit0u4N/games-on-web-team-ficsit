import React from 'react';
import { Avatar, Badge, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { simulateRoll } from '@dice/view/React/DiceComponent.tsx';
import { Character } from '@character/model/Character.ts';
import { Sport } from '@core/singleton/Sport.ts';

type NPCProps = {
  npc: { rank: number; character: Character; diceRoll: number };
  isRolled?: boolean;
};

export const NPC: React.FC<NPCProps> = ({ npc, isRolled = false }) => {
  const [diceValue, setDiceValue] = React.useState(isRolled ? npc.diceRoll : 0);
  const [avatarIsDisabled, setAvatarIsDisabled] = React.useState(false);
  const [showBadge, setShowBadge] = React.useState(isRolled);

  async function rollDice(finalValue: number, nbRolls: number = 30) {
    setAvatarIsDisabled(true);
    await simulateRoll(finalValue, setDiceValue, nbRolls);
    setTimeout(() => {
      setAvatarIsDisabled(false);
      setShowBadge(true);
    }, 3000);
  }

  React.useEffect(() => {
    if (!isRolled) rollDice(npc.diceRoll);
  }, []);

  const sports = Array.from<Sport>(npc.character.statistics.keys());

  return (
    <Popover placement={'bottom'} isOpen={showBadge ? undefined : false}>
      <PopoverTrigger>
        <div className={'size-[70px] flex flex-col justify-center items-center'}>
          <div className={'flex justify-center items-center w-full'}>
            <Badge content={showBadge ? diceValue : null} placement={'bottom-left'}>
              <Avatar isDisabled={avatarIsDisabled} src={npc.character.image} isBordered radius={'full'} size={'lg'} />
            </Badge>
          </div>
          {!showBadge ? (
            <div className={'size-0 relative z-10 top-[-39px] w-full'}>
              <div className={'w-full flex items-center justify-center text-center'}>
                <span className={'text-xl font-bold text-gray-600 '}>{diceValue}</span>
              </div>
            </div>
          ) : null}
        </div>
      </PopoverTrigger>
      <PopoverContent>
        Statistiques du personnage
        <div>
          {sports.map((sport, index) => (
            <div key={index}>
              {sport.name}: {npc.character.statistics.get(sport)}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
