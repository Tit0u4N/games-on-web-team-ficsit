import React from 'react';
import { UsableObject } from '../../model/UsableObject.ts';
import { Image } from '@nextui-org/react';

interface Props {
  item: UsableObject;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const UsableObjectView: React.FC<Props> = ({ item, handleDragStart }) => {
  return (
    <div className={'size-full'} onDragStart={handleDragStart}>
      <Image
        src={item.image}
        alt={item.name}
        height={'100%'}
        width={'100%'}
        className="size-full object-cover hover:scale-110 transition-transform duration-300 ease-in-out"
      />
    </div>
  );
};
