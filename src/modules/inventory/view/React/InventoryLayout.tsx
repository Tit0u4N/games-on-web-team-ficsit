import { Card, Divider } from '@nextui-org/react';
import React from 'react';
import { InventoryCase } from '../../../../component/InventoryCase.tsx';
import { Inventory } from '../../model/Inventory.ts';
import { config } from '../../../../core/Interfaces.ts';
import { EquippedObjectSlot } from '../../model/EquippedObjects.ts';

type InventoryLayoutProps = {
  inventory: Inventory;
};

export const InventoryLayout: React.FC<InventoryLayoutProps> = ({ inventory }) => {
  return (
    <Card radius={'lg'} className={'flex flex-col gap-1 w-[380px] p-2'}>
      <div className="w-full h-[300px]">
        <div className="flex justify-between p-[10px] h-full w-full">
          <div className="flex flex-col w-1/5 gap-1">
            <InventoryCase inventory={inventory} slot={EquippedObjectSlot.HEAD} />
            <InventoryCase inventory={inventory} slot={EquippedObjectSlot.CHEST} />
            <InventoryCase inventory={inventory} slot={EquippedObjectSlot.LEGS} />
            <InventoryCase inventory={inventory} slot={EquippedObjectSlot.FEET} />
          </div>

          <Divider orientation={'vertical'} />

          <div className="w-[75%] h-full flex rounded-xl bg-case"></div>
        </div>
      </div>
      <Divider />
      <div className="w-full h-[300px] justify-center">
        <div className="grid grid-cols-5 gap-1 p-[10px]">
          {Array.from({ length: config.character.inventory.maxItems }, (_, index) => (
            <InventoryCase key={index} position={index} inventory={inventory} />
          ))}
        </div>
      </div>
    </Card>
  );
};
