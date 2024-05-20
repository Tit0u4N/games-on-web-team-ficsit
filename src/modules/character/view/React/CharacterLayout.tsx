import React from 'react';
import { Card, Image, CardBody, Divider } from '@nextui-org/react';
import { Character } from '../../model/Character';
import { InventoryCase } from '../../../../component/InventoryCase.tsx';

interface CharacterLayoutProps {
  character: Character;
  isInTournament?: boolean;
}

const CharacterLayout: React.FC<CharacterLayoutProps> = ({ character, isInTournament }) => {
  return (
    <Card className={isInTournament ? 'w-[100%]' : 'w-[28%]' + ' h-[150px]'}>
      <CardBody>
        <div className="flex size-full">
          <div className="relative mr-4 flex-shrink-0 mt-auto mb-auto p-1">
            <Image
              alt="Album cover"
              src={character.image}
              className="object-cover aspect-square"
              height={120}
              width={120}
            />
          </div>
          <Divider orientation="vertical" />
          <div className="flex flex-col justify-between w-full p-1">
            <div className="">
              <h3 className="text-xl">{character.name}</h3>
            </div>
            <Divider />
            <div className="grid grid-cols-5 gap-1 ">
              {character.inventory.items.map((item, index) => (
                <InventoryCase key={index} item={item} />
              ))}
              {Array.from({ length: 5 - character.inventory.items.length }, (_, index) => (
                <InventoryCase key={index} />
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CharacterLayout;
