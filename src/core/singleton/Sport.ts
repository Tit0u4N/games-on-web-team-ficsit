import { Season } from './Season.ts';
import { config } from '../Interfaces.ts';

export class Sport {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _icon: string;
  private readonly _description: string;
  private readonly _seasons: Season[];
  private readonly _iconPath: string;
  private static idCounter = 0;

  private static allSports: Sport[];

  constructor(name: string, icon: string, description: string, seasons: Season[] = []) {
    this._id = Sport.idCounter++;
    this._name = name;
    this._icon = icon;
    this._description = description;
    this._seasons = seasons;
    this._iconPath = 'images/sports/' + this._icon + '.svg';
  }

  // Static methods

  static getAll(): Sport[] {
    if (!Sport.allSports) Sport.allSports = Sport.createAllSports();
    return Sport.allSports;
  }

  static getRandom(): Sport {
    return Sport.getAll()[Math.floor(Math.random() * Sport.allSports.length)];
  }

  static getRandoms(nbSports: number): Sport[] {
    //todo need to be tested
    if (nbSports >= Sport.getAll().length) return Sport.getAll();
    const sports = [...Sport.getAll()];
    const result: Sport[] = [];
    for (let i = 0; i < nbSports; i++) {
      const index = Math.floor(Math.random() * sports.length);
      result.push(sports[index]);
      sports.splice(index, 1);
    }
    return result;
  }

  static getById(id: number): Sport | undefined {
    return Sport.getAll().find((sport) => sport.is(sport));
  }

  static getByName(name: string): Sport | undefined {
    return Sport.getAll().find((sport) => sport._name.toUpperCase() === name.toUpperCase());
  }

  static getBySeason(season: Season | string): Sport[] {
    let temp: any = season;
    if (typeof season === 'string') temp = Season.getByName(season);
    if (temp === undefined) return [];
    return Sport.getAll().filter((sport) => !!sport._seasons.find((s) => s.is(temp)));
  }

  private static createAllSports(): Sport[] {
    return config.sports.all.map((sport) => {
      const seasons = sport.seasons.map((seasonName: string) => Season.getByName(seasonName));
      if (seasons.includes(undefined)) throw new Error(`Season not found for sport ${sport.name}`);
      return new Sport(sport.name, sport.icon, sport.description, seasons as Season[]);
    });
  }

  // Methods

  is(sport: Sport): boolean {
    return this._id === sport._id;
  }

  isSeason(season: Season): boolean {
    return this._seasons.includes(season);
  }

  // Accessors

  get name(): string {
    return this._name;
  }

  get icon(): string {
    return this._icon;
  }

  get description(): string {
    return this._description;
  }

  get iconPath(): string {
    return this._iconPath;
  }
}
