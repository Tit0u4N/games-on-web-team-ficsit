import React from 'react';
import { UsableObject } from '../../model/UsableObject.ts';
import { Image, Tooltip } from '@nextui-org/react';
import { Sport } from '@core/singleton/Sport.ts';
import { ObjectRarity } from '../../model/ObjectRarity.ts';

interface Props {
  item: UsableObject;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const UsableObjectView: React.FC<Props> = ({ item, handleDragStart }) => {
  const getTxClass = (object: ObjectRarity) => {
    return 'text-' + object.color;
  };

  const getRGBColor = (object: ObjectRarity) => {
    switch (object.color) {
      case 'default':
        return 'drop-shadow-[0_3px_6px_rgb(212,212,216)]';
      case 'secondary':
        return 'drop-shadow-[0_3px_6px_rgb(120,40,200)]';
      case 'success':
        return 'drop-shadow-[0_3px_6px_rgb(24,201,100)]';
    }
  };

  const tooltipContent = (
    <div>
      <p>{item.name}</p>
      <p>{item.slot}</p>
      <p className={getTxClass(item.rarity) + ' font-bold'}>{item.rarity.name}</p>
      <div>
        {Array.from<Sport>(item.statsIncrease.keys()).map(
          (sport) =>
            item.statsIncrease.get(sport) !== 0 && (
              <p key={sport.name}>
                {sport.name}: +{item.statsIncrease.get(sport)}
              </p>
            ),
        )}
      </div>
    </div>
  );
  return (
    <div className={'size-full rounded-lg'} onDragStart={handleDragStart}>
      <Tooltip showArrow={true} content={tooltipContent} placement="bottom">
        <Image
          src={'images/objects/' + item.image}
          alt={item.name}
          sizes={'100%'}
          className={
            'size-full object-cover hover:scale-110 transition-transform duration-300 ease-in-out select-none cursor-pointer ' +
            getRGBColor(item.rarity)
          }
        />
      </Tooltip>
    </div>
  );
};
