import React, { useState } from 'react';
import { UsableObjectView } from '../modules/object/view/React/UsableObjectView.tsx';
import { UsableObject } from '../modules/object/model/UsableObject.ts';
import { DnDItemManager } from '../core/singleton/DndItemManager.ts';

type InventoryCaseProps = {
  itemBase?: UsableObject;
  className?: string;
};

export const InventoryCase: React.FC<InventoryCaseProps> = ({ itemBase = null, className = '' }) => {
  const [item, setItem] = useState<UsableObject | null>(itemBase);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    DnDItemManager.getInstance().setDraggedItem(item, setItem);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setItem(DnDItemManager.getInstance().getDraggedItem());
  };

  className = 'p-[8px] aspect-square w-full rounded-xl bg-case ' + className;
  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver} className={className}>
      {item && <UsableObjectView item={item} handleDragStart={handleDragStart} />}
    </div>
  );
};
