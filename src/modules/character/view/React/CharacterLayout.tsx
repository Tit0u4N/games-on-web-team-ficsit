import React from 'react';
import { Card, Image, CardBody, Divider } from '@nextui-org/react';
import { Character } from '../../model/Character';

interface CharacterLayoutProps {
  character: Character;
}

const CharacterLayout: React.FC<CharacterLayoutProps> = ({ character }) => {
  console.log('CharacterLayout');
  return (
    <Card className='w-[30%] h-[200px]'>
      <CardBody>
        <div className='flex w-full h-full'>
          <div className='relative mr-4 flex-shrink-0' style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <Image
              alt='Album cover'
              className='object-cover h-full w-full rotate-45'
              height={200}
              shadow='md'
              src={character.image}
              style={{ backgroundColor: 'green' }}
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
                <div key={index} style={{ background: 'brown', padding: '5px', width: '40px', height: '40px' }}>
                  <Image
                    alt={`Image ${index + 1}`}
                    className='object-cover h-full w-full'
                    height={40} // Adjust the size of the images as needed
                    src={`/image_${index + 1}.jpg`} // Replace with the actual path
                    style={{ backgroundColor: 'green', height: '0'}}
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
