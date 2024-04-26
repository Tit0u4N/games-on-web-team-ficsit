import { Sport, SportType } from '../../sport/model/Sport.ts';
import { Statistics } from '../../character/model/Statistics.ts';
import * as gameObjectsData from './gameObjects.json';

export class UsableObject {
  private readonly _name: string;
  private readonly _sport: Sport;
  private readonly _image: string;
  private readonly _statsIncrease: Statistics;

  constructor(name: string, sport: SportType, image: string, statsIncrease: Statistics) {
    this._name = name;
    this._sport = new Sport(sport);
    this._image = 'objectImages/' + image;
    this._statsIncrease = statsIncrease;
  }

  get statsIncrease(): Statistics {
    return this._statsIncrease;
  }

  get name(): string {
    return this._name;
  }

  get sport(): Sport {
    return this._sport;
  }

  get image(): string {
    return this._image;
  }
}

interface GameObjectData {
  name: string;
  sport: SportType;
  image: string;
  statsIncrease: StatIncrease[];
}

interface StatIncrease {
  sport: SportType;
  bonus: number;
}


function parseGameObjects(data: GameObjectData[]): UsableObject[] {
  console.log(data);
  return data.map((obj) => {
    const statsIncrease = new Map<Sport, number>();
    obj.statsIncrease.forEach((stat) => {
      statsIncrease.set(new Sport(stat.sport), stat.bonus);
    });
    return new UsableObject(obj.name, obj.sport, obj.image, new Statistics(statsIncrease));
  });
}

export const gameObjects:UsableObject[] = parseGameObjects(gameObjectsData.default);
