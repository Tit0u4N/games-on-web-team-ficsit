import React from 'react';
import { NPC } from './NPC.tsx';
import { Character } from '../../../character/model/Character.ts';

type NPCProps = {
  npcs: Array<{ rank: number; character: Character; diceRoll: number }>;
  className?: string;
};

export const NPCList: React.FC<NPCProps> = ({ npcs, className }) => {
  return (
    <div className={'gap-4 flex pt-2 pb-4 px-4 border border-default-200 rounded-2xl ' + className}>
      {npcs.map((npc, index) => (
        <NPC npc={npc} key={index} />
      ))}
    </div>
  );
};
