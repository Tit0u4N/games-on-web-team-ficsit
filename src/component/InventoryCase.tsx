import React, { useState } from 'react';
import { UsableObjectView } from '../modules/object/view/React/UsableObjectView.tsx';
import { UsableObject } from '../modules/object/model/UsableObject.ts';
import { DnDItemManager } from '../core/singleton/DndItemManager.ts';
import { Inventory } from '../modules/inventory/model/Inventory.ts';
import { EquippedObjectSlot } from '../modules/inventory/model/EquippedObjects.ts';

type InventoryCaseProps = {
  itemBase?: UsableObject | null;
  inventory: Inventory;
  slot?: EquippedObjectSlot;
};

export const InventoryCase: React.FC<InventoryCaseProps> = ({ itemBase = null, inventory, slot }) => {
  const [item, setItem] = useState<UsableObject | null>(itemBase);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    DnDItemManager.getInstance().setDraggedItem(item, setItem, inventory);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    DnDItemManager.getInstance().dropItem(item, setItem, inventory, slot);
  };

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver} className={'p-[8px] aspect-square w-full rounded-xl bg-case'}>
      {item && <UsableObjectView item={item} handleDragStart={handleDragStart} />}
    </div>
  );
};
