import React, { useState } from 'react';
import { UsableObjectView } from '@object/view/React/UsableObjectView.tsx';
import { UsableObject } from '@object/model/UsableObject.ts';
import { DnDItemManager } from '../core/singleton/DndItemManager.ts';
import { Inventory } from '@inventory/model/Inventory.ts';
import { EquippedObjectSlot } from '@inventory/model/EquippedObjects.ts';

type InventoryCaseProps = {
  inventory: Inventory;
  position?: number;
  slot?: EquippedObjectSlot;
  onChange?: () => void;
};

export const InventoryCase: React.FC<InventoryCaseProps> = ({ inventory, position, slot, onChange }) => {
  let baseItem: UsableObject | null = null;
  if (position !== undefined) {
    baseItem = inventory.getItemsFromPosition(position);
  } else if (slot) {
    baseItem = inventory.equippedItems.get(slot);
  }

  const [item, setItem] = useState<UsableObject | null>(baseItem);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    DnDItemManager.getInstance().setDraggedItem(item, setItem, inventory, position, slot);
    onChange && onChange();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    DnDItemManager.getInstance().dropItem(item, setItem, inventory, position, slot);
    onChange && onChange();
  };

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver} className={'p-[8px] aspect-square w-full rounded-xl bg-case'}>
      {item && <UsableObjectView item={item} handleDragStart={handleDragStart} />}
    </div>
  );
};
