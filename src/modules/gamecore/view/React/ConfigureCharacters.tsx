import { GameCorePresenter } from '@gamecore/presenter/GameCorePresenter.ts';
import React, { useState } from 'react';
import { Button, Card, CardBody, Input, Select, Image, Tabs, Tab, SelectItem } from '@nextui-org/react';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { CountryCode } from '@core/Country.tsx';
import { Sport } from '@core/singleton/Sport.ts'; // Adjust the import path as necessary

interface Character {
  logo: string;
  name: string;
  lastName: string;
  nationality: CountryCode;
  stats: Record<string, number>;
}

interface Props {
  presenter: GameCorePresenter;
}

const sports = Sport.getAll();
const initialStats = sports.reduce(
  (acc, sport) => {
    acc[sport.name] = 0;
    return acc;
  },
  {} as Record<string, number>,
);

export const ConfigureCharacters: React.FC<Props> = ({ presenter }) => {
  const [characters, setCharacters] = useState<Character[]>([
    { logo: '', name: '', lastName: '', nationality: CountryCode.USA, stats: { ...initialStats } },
    { logo: '', name: '', lastName: '', nationality: CountryCode.USA, stats: { ...initialStats } },
    { logo: '', name: '', lastName: '', nationality: CountryCode.USA, stats: { ...initialStats } },
  ]);

  const [pointsLeft, setPointsLeft] = useState<number[]>([20, 20, 20]); // Assume 20 points to distribute per character

  const handleInputChange = (index: number, field: keyof Character, value: string | CountryCode) => {
    const newCharacters = [...characters];
    newCharacters[index] = { ...newCharacters[index], [field]: value };
    setCharacters(newCharacters);
  };

  const handleStatChange = (index: number, sport: string, value: number) => {
    const newCharacters = [...characters];
    const currentPoints = pointsLeft[index];
    const currentStat = newCharacters[index].stats[sport];

    if (value >= 0 && value <= 20 && currentPoints - (value - currentStat) >= 0) {
      newCharacters[index].stats[sport] = value;
      setCharacters(newCharacters);
      setPointsLeft((prev) => {
        const newPoints = [...prev];
        newPoints[index] = currentPoints - (value - currentStat);
        return newPoints;
      });
    }
  };

  const cardSize = 'w-[500px] h-[600px] p-2 pb-4';

  return (
    <div className={'h-[100vh] w-[100vw] bg-menu bg-cover'}>
      <div className={'size-full backdrop-blur flex flex-col items-center justify-center'}>
        <div className={'mt-[-50px] h-[640px] font-semibold'}>
          <Tabs size={'lg'} fullWidth={true} aria-label={'Menu'}>
            {characters.map((character, index) => (
              <Tab
                key={`Character${index + 1}`}
                title={`Character ${index + 1}`}
                aria-label={`Menu Configuration Character${index + 1}`}
                className={'h-[50px] '}>
                <Card className={cardSize}>
                  <CardBody className={'flex flex-col'}>
                    <div className={'mb-4'}>
                      <label className={'block text-lg font-medium mb-2'}>Logo</label>
                      <Input
                        type="file"
                        onChange={(e) => handleInputChange(index, 'logo', URL.createObjectURL(e.target.files![0]))}
                      />
                      {character.logo && <Image src={character.logo} alt="Logo" className={'mt-2'} />}
                    </div>
                    <Input
                      placeholder="Name"
                      aria-label={'Name'}
                      value={character.name}
                      onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                      className={'mb-4'}
                    />
                    <Input
                      placeholder="Last Name"
                      aria-label={'Last Name'}
                      value={character.lastName}
                      onChange={(e) => handleInputChange(index, 'lastName', e.target.value)}
                      className={'mb-4'}
                    />
                    <Select
                      placeholder="Nationality"
                      aria-label={'National'}
                      value={character.nationality}
                      onChange={(e) => handleInputChange(index, 'nationality', e.target.value as CountryCode)}
                      className={'mb-4'}>
                      {Object.values(CountryCode).map((code) => (
                        <SelectItem key={code} value={code}>
                          <div className="flex items-center">
                            {getUnicodeFlagIcon(code)}
                            <span className="ml-2">{code}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                    <div className={'mb-4'}>
                      <label className={'block text-lg font-medium mb-2'}>
                        Distribute Points (Remaining: {pointsLeft[index]})
                      </label>
                      {sports.map((sport) => (
                        <div key={sport.name} className={'mb-2'}>
                          <label className={'block text-md mb-1'} aria-label={`Distribute Points for ${sport.name}`}>
                            {sport.name}
                          </label>
                          <Input
                            type="number"
                            min={0}
                            max={20}
                            value={character.stats[sport.name].toString()}
                            onChange={(e) => handleStatChange(index, sport.name, parseInt(e.target.value))}
                          />
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </Tab>
            ))}
          </Tabs>
        </div>
        <Button
          color="primary"
          className={'w-[250px] h-[75px] text-white text-3xl'}
          onClick={() => presenter.startGame()}>
          Start Game
        </Button>
      </div>
    </div>
  );
};
