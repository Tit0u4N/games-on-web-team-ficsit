import React from 'react';
import { NPC } from './NPC.tsx';

type NPCProps = {
  npcs: Array<object>;
  className?: string;
};

export const NPCList : React.FC<NPCProps> = ({npcs, className}) => {



  return (
    <div className={"gap-4 flex pt-2 pb-4 px-4 overflow-x-auto border border-default-200 rounded-2xl " + className}>
      {
        npcs.map((npc, index) => (
          <NPC npc={npc} key={index} />
        ))
      }
    </div>
  );
}