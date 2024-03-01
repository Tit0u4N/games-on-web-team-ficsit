import React from 'react';
import { Card, Image, CardBody, Divider } from '@nextui-org/react';
import { Character } from '../../model/Character';

interface CharacterLayoutProps {
  character: Character;
}

const CharacterLayout: React.FC<CharacterLayoutProps> = ({ character }) => {
  return (
    <Card className='w-[30%] h-[200px]'>
      <CardBody>
        <div
          className='flex w-full h-full'>
          <div className='relative mr-4 flex-shrink-0 mt-auto mb-auto'>
            <Image
              alt='Album cover'
              className='object-cover h-[150px] w-full'
              shadow='md'
              src={character.image}
            />
          </div>
          <Divider orientation='vertical' />
          <div className='flex-col'>
            <div className='h-[50%]'>
              <p>{character.name}</p>
            </div>
            <Divider />
            <div className='grid grid-cols-5 gap-0.5 h-[40px]'>
              {/* Create a grid with 5 columns and 2 rows */}
              {Array.from({ length: 10 }, (_, index) => (
                <div key={index} className='bg-amber-950	p-[5px] w-[40px] h-[40px]'>
                  <Image
                    alt={`Image ${index + 1}`}
                    className='object-cover h-0 w-full bg-green-500'
                    height={40} // Adjust the size of the images as needed
                    src={`/image_${index + 1}.jpg`} // Replace with the actual path
                  />
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
