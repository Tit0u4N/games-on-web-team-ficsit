import { config } from '../Interfaces.ts';

export class Season {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _icon: string;

  private static idCounter = 0;

  private static allSeasons: Season[];

  constructor(name: string, icon: string) {
    this._id = Season.idCounter++;
    this._name = name;
    this._icon = icon;
  }

  // Static methods

  static getAll(): Season[] {
    if (!Season.allSeasons) Season.allSeasons = Season.createAllSeasons();
    return Season.allSeasons;
  }

  static getById(id: number): Season | undefined {
    return Season.getAll().find((season) => season._id === id);
  }

  static getByName(name: string): Season | undefined {
    return Season.getAll().find((season) => season._name.toUpperCase() === name.toUpperCase());
  }

  private static createAllSeasons(): Season[] {
    return config.seasons.all.map((season) => new Season(season.name, season.icon));
  }

  // Methods

  is(season: Season): boolean {
    return this._id === season._id;
  }

  // Accessors

  get name(): string {
    return this._name;
  }

  get icon(): string {
    return this._icon;
  }
}
