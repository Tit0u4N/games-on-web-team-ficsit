import { GameCorePresenter } from '@gamecore/presenter/GameCorePresenter.ts';
import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Input, Image, Tabs, Tab, Badge } from '@nextui-org/react';
import { Country, CountryCode } from '@core/Country.tsx';
import { Sport } from '@core/singleton/Sport.ts';
import { Character } from '@character/model/Character.ts';

interface ICharacter {
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
const FLAGS_PER_PAGE = 15;
const initialStats = sports.reduce(
  (acc, sport) => {
    acc[sport.name] = 0;
    return acc;
  },
  {} as Record<string, number>,
);

export const ConfigureCharacters: React.FC<Props> = ({ presenter }) => {
  // clear the localStorage
  localStorage.clear();

  const [characters, setCharacters] = useState<ICharacter[]>([
    { logo: '', name: '', lastName: '', nationality: CountryCode.FRANCE, stats: { ...initialStats } },
    { logo: '', name: '', lastName: '', nationality: CountryCode.FRANCE, stats: { ...initialStats } },
    { logo: '', name: '', lastName: '', nationality: CountryCode.FRANCE, stats: { ...initialStats } },
  ]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pointsLeft, setPointsLeft] = useState<number[]>([20, 20, 20]);

  const totalFlags = Object.values(CountryCode).length;
  const totalPages = Math.ceil(totalFlags / FLAGS_PER_PAGE);

  const startIndex = currentPage * FLAGS_PER_PAGE;
  const endIndex = Math.min(startIndex + FLAGS_PER_PAGE, totalFlags);
  const currentFlags = Object.values(CountryCode).slice(startIndex, endIndex);

  useEffect(() => {
    // Load saved stats from storage when the component mounts
    const savedStats = JSON.parse(localStorage.getItem('characterStats') || '{}');
    if (Object.keys(savedStats).length > 0) {
      setCharacters(savedStats.characters);
      setPointsLeft(savedStats.pointsLeft);
    }
  }, []);

  useEffect(() => {
    // Save stats to storage whenever characters or pointsLeft change
    localStorage.setItem('characterStats', JSON.stringify({ characters, pointsLeft }));
  }, [characters, pointsLeft]);

  const handleInputChange = (index: number, field: keyof ICharacter, value: string | CountryCode) => {
    const newCharacters = [...characters];
    newCharacters[index] = { ...newCharacters[index], [field]: value };
    setCharacters(newCharacters);
  };

  const handleStatChange = (index: number, sport: string, change: number) => {
    const newCharacters = [...characters];
    const currentPoints = pointsLeft[index];
    const currentStat = newCharacters[index].stats[sport];

    const newStatValue = currentStat + change;
    if (newStatValue >= 0 && newStatValue <= 20 && currentPoints - change >= 0) {
      newCharacters[index].stats[sport] = newStatValue;
      setCharacters(newCharacters);
      setPointsLeft((prev) => {
        const newPoints = [...prev];
        newPoints[index] = currentPoints - change;
        return newPoints;
      });
    }
  };

  const validateCharacters = () => {
    for (const character of characters) {
      if (Object.values(character).some((value) => !value)) {
        return false;
      }
    }
    return true;
  };

  const startGame = () => {
    if (validateCharacters()) {
      // For each character, create a Character object and add it to a Set
      const charactersOfSet = new Set<Character>();

      presenter.startGame(charactersOfSet);
    } else {
      alert('Please complete all character data before starting the game.');
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
                    <Badge content={'!'} color="danger" isInvisible={!!character.name}>
                      <span></span>
                    </Badge>
                    <Input
                      placeholder="Name"
                      aria-label={'Name'}
                      value={character.name}
                      onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                      className={'mb-4'}
                    />
                    <Badge content={'!'} color="danger" isInvisible={!!character.lastName}>
                      <span></span>
                    </Badge>
                    <Input
                      placeholder="Last Name"
                      aria-label={'Last Name'}
                      value={character.lastName}
                      onChange={(e) => handleInputChange(index, 'lastName', e.target.value)}
                      className={'mb-4'}
                    />
                    <Badge content={'!'} color="danger" isInvisible={!!character.nationality}>
                      <span></span>
                    </Badge>
                    <div className={'mb-4'}>
                      <label className={'block text-lg font-medium mb-2'}>Nationality</label>
                      <div className="grid grid-cols-5 gap-4">
                        {currentFlags.map((code) => (
                          <button
                            key={code}
                            onClick={() => handleInputChange(index, 'nationality', code)}
                            className={`p-2 border-2 ${character.nationality === code ? 'border-blue-500' : 'border-transparent'}`}>
                            <div className="flex flex-col items-center">
                              {new Country(code).getFlag()}
                              <span className="text-sm">{code}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between mt-4">
                        <Button
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                          disabled={currentPage === 0}>
                          Previous
                        </Button>
                        <Button
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                          disabled={currentPage === totalPages - 1}>
                          Next
                        </Button>
                      </div>
                    </div>
                    <Badge content={'!'} color="danger" isInvisible={pointsLeft[index] === 0}>
                      <span></span>
                    </Badge>
                    <div className={'mb-4'}>
                      <label className={'block text-lg font-medium mb-2'}>
                        Distribute Points (Remaining: {pointsLeft[index]})
                      </label>
                      {sports.map((sport) => (
                        <div key={sport.name} className={'flex items-center justify-between mb-2'}>
                          <span className="w-1/3">{sport.name}</span>
                          <span className="w-1/6 text-center">{character.stats[sport.name]}</span>
                          <div className="flex items-center w-1/2">
                            <Button
                              size="sm"
                              onClick={() => handleStatChange(index, sport.name, -1)}
                              disabled={character.stats[sport.name] === 0}
                              className="mx-2">
                              -
                            </Button>
                            <span className="mx-2">{character.stats[sport.name]}</span>
                            <Button
                              size="sm"
                              onClick={() => {
                                handleStatChange(index, sport.name, 1);
                              }}
                              disabled={pointsLeft[index] === 0}
                              className="mx-2">
                              +
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </Tab>
            ))}
          </Tabs>
        </div>
        <Button color="primary" className={'w-[250px] h-[75px] text-white text-3xl'} onClick={startGame}>
          Start Game
        </Button>
      </div>
    </div>
  );
};
