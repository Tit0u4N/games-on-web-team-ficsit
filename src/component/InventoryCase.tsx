import React from 'react';
import { Image } from '@nextui-org/react';

type InventoryCaseProps = {
  key: number;
  item?: any;
  className?: string;
};

export const InventoryCase: React.FC<InventoryCaseProps> = ({ key, item, className = '' }) => {
  console.log('InventoryCase', key);
  const isEmpty: boolean = !item;
  className = 'p-[8px] aspect-square w-full rounded-xl bg-case ' + className;
  return (
    <div key={key} className={className}>
      {isEmpty ? null : (
        <Image
          src={item.image}
          alt={item.name}
          height={'100%'}
          width={'100%'}
          className="size-full object-cover hover:scale-110 transition-transform duration-300 ease-in-out"
        />
      )}
    </div>
  );
};
