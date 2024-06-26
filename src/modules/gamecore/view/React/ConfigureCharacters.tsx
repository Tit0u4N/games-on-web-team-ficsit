import { GameCorePresenter } from '@gamecore/presenter/GameCorePresenter.ts';
import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Input, Image, Tabs, Tab, Badge } from '@nextui-org/react';
import { Country, CountryCode } from '@core/Country.tsx';
import { Sport } from '@core/singleton/Sport.ts';
import { Character } from '@character/model/Character.ts';
import { names, uniqueNamesGenerator } from 'unique-names-generator';
import { CharacterFactory } from '@character/BuilderFactory/CharacterFactory.ts';
import { Statistics } from '@character/model/Statistics.ts';

interface ICharacter {
  logo: string;
  name: string;
  age: number;
  nationality: Country;
  stats: Record<string, number>;
  modelName: string;
  modelPath: string;
}

interface Props {
  presenter: GameCorePresenter;
}

const sports = Sport.getAll();
const FLAGS_PER_PAGE = 15;
const POINT_STAT = 55;
const MIN_PAR_STAT = 5;
const remainingPoints = POINT_STAT - sports.length * MIN_PAR_STAT;
const initialStats = sports.reduce(
  (acc, sport) => {
    acc[sport.name] = MIN_PAR_STAT;
    return acc;
  },
  {} as Record<string, number>,
);
const LOGOS_PER_PAGE = 5;

const logos: string[] = [];
for (let i = 1; i <= 64; i++) {
  logos.push('./images/characters/character' + i + '.png');
}

export const ConfigureCharacters: React.FC<Props> = ({ presenter }) => {
  // clear the localStorage
  localStorage.clear();

  const [characters, setCharacters] = useState<ICharacter[]>([
    {
      logo: '',
      name: '',
      age: 20,
      nationality: new Country(CountryCode.FRANCE),
      stats: { ...initialStats },
      modelName: 'Animated Woman.glb',
      modelPath: 'pawn/',
    },
    {
      logo: '',
      name: '',
      age: 20,
      nationality: new Country(CountryCode.FRANCE),
      stats: { ...initialStats },
      modelName: 'Hoodie Character.glb',
      modelPath: 'pawn/',
    },
    {
      logo: '',
      name: '',
      age: 20,
      nationality: new Country(CountryCode.FRANCE),
      stats: { ...initialStats },
      modelName: 'Suit.glb',
      modelPath: 'pawn/',
    },
  ]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [currentLogoPage, setCurrentLogoPage] = useState<number>(0);
  const [pointsLeft, setPointsLeft] = useState<number[]>([remainingPoints, remainingPoints, remainingPoints]);
  const [isRandomGenerated, setIsRandomGenerated] = useState<boolean>(false);

  const totalFlags = Object.values(CountryCode).length;
  const totalPages = Math.ceil(totalFlags / FLAGS_PER_PAGE);

  const startIndex = currentPage * FLAGS_PER_PAGE;
  const endIndex = Math.min(startIndex + FLAGS_PER_PAGE, totalFlags);
  const currentFlags = Object.values(CountryCode).slice(startIndex, endIndex);

  const totalLogos = logos.length;
  const totalLogoPages = Math.ceil(totalLogos / LOGOS_PER_PAGE);

  const startLogoIndex = currentLogoPage * LOGOS_PER_PAGE;
  const endLogoIndex = Math.min(startLogoIndex + LOGOS_PER_PAGE, totalLogos);
  const currentLogos = logos.slice(startLogoIndex, endLogoIndex);

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
    if (field === 'age') {
      const age = parseInt(value as string, 10);
      if (age >= 10 && age <= 99) {
        newCharacters[index] = { ...newCharacters[index], age };
        setCharacters(newCharacters);
        return;
      }
    } else if (field === 'nationality') {
      newCharacters[index] = { ...newCharacters[index], nationality: new Country(value as CountryCode) };
    } else {
      newCharacters[index] = { ...newCharacters[index], [field]: value };
    }
    setCharacters(newCharacters);
  };

  const handleStatChange = (index: number, sport: string, change: number) => {
    const newCharacters = [...characters];
    const currentPoints = pointsLeft[index];
    const currentStat = newCharacters[index].stats[sport];

    const newStatValue = currentStat + change;
    if (newStatValue >= 5 && newStatValue <= 15 && currentPoints - change >= 0) {
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
      const charactersOfSet = new Set<Character>();

      characters.forEach((character, index) => {
        const characterObj = CharacterFactory.createDefaultCharacter(
          index + 1,
          character.name,
          character.nationality,
          character.age,
          character.logo,
          character.modelName,
          character.modelPath,
        );
        const stats = new Map<Sport, number>();
        for (const sport of sports) {
          stats.set(sport, character.stats[sport.name]);
        }
        characterObj.statistics = Statistics.createFromLevelMap(stats);
        charactersOfSet.add(characterObj);
      });

      presenter.startGame(charactersOfSet);
    } else {
      alert('Please complete all character data before starting the game.');
    }
  };

  const generateRandomCharacters = () => {
    const models = ['Animated Woman.glb', 'Hoodie Character.glb', 'Suit.glb'];
    const randomCharacters = Array.from({ length: 3 }, (_) => {
      const randomStats: Record<string, number> = {};
      let remainingPoints = 25;
      for (const sport of sports) {
        randomStats[sport.name] = 5;
      }

      // Shuffle sports array to distribute points more evenly
      const shuffledSports = sports.sort(() => Math.random() - 0.5);
      let i = 0;
      while (remainingPoints > 0) {
        const sport = shuffledSports[i];
        let randomPoints = Math.floor(Math.random() * 10);
        if (randomPoints > remainingPoints) randomPoints = remainingPoints;
        randomStats[sport.name] += randomPoints;
        remainingPoints -= randomPoints;
        i++;
        if (i === sports.length) i = 0;
      }

      setPointsLeft([0, 0, 0]);

      const modelName = models[Math.floor(Math.random() * models.length)];
      // remove it from the array
      const index = models.indexOf(modelName);
      if (index > -1) {
        models.splice(index, 1);
      }

      return {
        logo: logos[Math.floor(Math.random() * logos.length)],
        name: uniqueNamesGenerator({ dictionaries: [names] }),
        age: Math.floor(Math.random() * 90) + 10,
        nationality: new Country(Object.values(CountryCode)[Math.floor(Math.random() * totalFlags)]),
        stats: randomStats,
        modelName: modelName,
        modelPath: 'pawn/',
      };
    });

    setCharacters(randomCharacters);
    setIsRandomGenerated(true);
  };

  const cardSize = 'w-[500px] h-[600px] p-2 pb-4';

  return (
    <div className={'h-[100vh] w-[100vw] bg-menu bg-cover'}>
      <div className={'size-full backdrop-blur flex flex-col items-center justify-center'}>
        <div className={'mt-[-50px] h-[640px] font-semibold'}>
          <Tabs size={'lg'} fullWidth={true} aria-label={'Menu'}>
            <Tab
              key={`RandomCharacter`}
              title={`Random Athletes`}
              aria-label={`Menu Configuration Random Character`}
              className={'h-[50px]'}>
              <Card className={cardSize}>
                <CardBody className={'flex flex-col justify-center items-center'}>
                  <Button
                    color="primary"
                    className={'w-[350px] h-[75px] text-white text-3xl z-10'}
                    onClick={generateRandomCharacters}>
                    Random Athletes
                  </Button>
                  {isRandomGenerated && (
                    <div className={'mt-4'}>
                      <p>Random Athletes Generated!</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Tab>
            {characters.map((character, index) => (
              <Tab
                key={`Character${index + 1}`}
                title={`Athlete ${index + 1}`}
                aria-label={`Menu Configuration Character${index + 1}`}
                className={'h-[50px] '}>
                <Card className={cardSize}>
                  <CardBody className={'flex flex-col'}>
                    <Badge content={'!'} color="danger" isInvisible={!!character.logo}>
                      <span></span>
                    </Badge>
                    <div className={'mb-4'}>
                      <label className={'block text-lg font-medium mb-2'}>Logo</label>
                      <div className="grid grid-cols-5 gap-4">
                        {currentLogos.map((logo, logoIndex) => (
                          <button
                            key={logoIndex}
                            onClick={() => handleInputChange(index, 'logo', logo)}
                            className={`border-2 ${character.logo === logo ? 'border-blue-500' : 'border-transparent'}`}>
                            <div className="flex flex-col items-center">
                              <Image src={logo} alt={`Logo ${logoIndex}`} />
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between mt-4">
                        <Button
                          onClick={() => setCurrentLogoPage((prev) => Math.max(prev - 1, 0))}
                          disabled={currentLogoPage === 0}>
                          Previous
                        </Button>
                        <Button
                          onClick={() => setCurrentLogoPage((prev) => Math.min(prev + 1, totalLogoPages - 1))}
                          disabled={currentLogoPage === totalLogoPages - 1}>
                          Next
                        </Button>
                      </div>
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
                    <Badge content={'!'} color="danger" isInvisible={!!character.age}>
                      <span></span>
                    </Badge>
                    <Input
                      type={'number'}
                      placeholder="Age"
                      aria-label={'Age'}
                      min={10}
                      max={99}
                      value={character.age.toString()}
                      onChange={(e) => handleInputChange(index, 'age', e.target.value)}
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
                            className={`p-2 border-2 ${character.nationality.getCode() === code ? 'border-blue-500' : 'border-transparent'}`}>
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
                              className={'mx-2'}>
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
        <Button color="primary" className={'w-[250px] h-[75px] text-white text-3xl z-10'} onClick={startGame}>
          Start Game
        </Button>
      </div>
    </div>
  );
};
