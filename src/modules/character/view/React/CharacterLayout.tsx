import React from 'react';
import { Card, Image, CardBody, Divider, Badge, Avatar } from '@nextui-org/react';
import { Character } from '@character/model/Character';
import { Season } from '@core/singleton/Season.ts';

interface CharacterLayoutProps {
  character: Character;
  season: Season;
  isInTournament?: boolean;
  isSelect?: boolean;
}

const CharacterLayout: React.FC<CharacterLayoutProps> = ({ character, isInTournament, season, isSelect = false }) => {
  const borderColor = isSelect ? ' outline outline-offset-2 outline-4 outline-primary' : '';

  return (
    <Card className={isInTournament ? 'w-[100%]' : 'w-[28%]' + ' h-[150px]  ' + borderColor}>
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
            <div className="w-full flex items-center align-center p-2">
              <h3 className="text-2xl">{character.name}</h3>
              <div className={'ms-2'}>{character.nationality.getFlag()}</div>
            </div>
            <Divider />
            <div className="grid grid-cols-6 gap-1 ">
              {Array.from(character.getStatsWithEffect(season).keys()).map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Badge
                    content={character.getStatsWithEffect(season).get(item)}
                    placement="bottom-right"
                    variant="shadow"
                    color="primary"
                    shape="circle">
                    <Avatar isBordered radius="full" src={item.iconPath} />
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CharacterLayout;
