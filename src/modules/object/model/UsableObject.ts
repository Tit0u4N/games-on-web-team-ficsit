import { Statistics } from '../../character/model/Statistics.ts';
import * as gameObjectsData from './gameObjects.json';

export class UsableObject {
  private readonly _name: string;
  private readonly _image: string;
  private readonly _statsIncrease: Statistics;

  constructor(name: string, image: string, statsIncrease: Statistics) {
    this._name = name;
    this._image = 'objectImages/' + image;
    this._statsIncrease = statsIncrease;
  }

  get statsIncrease(): Statistics {
    return this._statsIncrease;
  }

  get name(): string {
    return this._name;
  }

  get image(): string {
    return this._image;
  }
}

interface GameObjectData {
  name: string;
  sport: string;
  image: string;
  stats: StatIncrease[];
}

interface StatIncrease {
  sport: string;
  bonus: number;
}

function parseGameObjects(data: GameObjectData[]): UsableObject[] {
  return data.map((obj) => {
    const statsIncrease = Statistics.createFromJsObject(obj.stats);
    return new UsableObject(obj.name, obj.image, statsIncrease);
  });
}

// todo read fix lint error
export const gameObjects: UsableObject[] = parseGameObjects(gameObjectsData.default);
