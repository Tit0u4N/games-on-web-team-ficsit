import { Statistics } from './Statistics';
import { Attributes } from './Attributes';
import { Inventory } from '@inventory/model/Inventory.ts';
import { ITile } from '@map/model/TileModel.ts';
import { Season } from '@core/singleton/Season.ts';
import { Country } from '@core/Country.tsx';

export class Character {
  private _id: number;
  private _name: string;
  private _nationality: Country;
  private _age: number;
  private _image: string;
  private _statistics: Statistics;
  private _inventory: Inventory;
  private _attributes: Attributes;
  private _currentTile: ITile | undefined;
  private readonly _isPlayer: boolean = false;
  private _modelName: string | undefined;
  private _modelPath: string | undefined;

  public constructor(
    id: number,
    name: string,
    nationality: Country,
    age: number,
    attributes: Attributes,
    image: string,
    isPlayer: boolean = false,
    modelName?: string,
    modelPath?: string,
  ) {
    this._id = id;
    this._name = name;
    this._nationality = nationality;
    this._age = age;
    this._inventory = new Inventory(this);
    this._statistics = new Statistics();
    this._attributes = attributes;
    this._image = image;
    this._modelName = modelName;
    this._modelPath = modelPath;
    this._isPlayer = isPlayer;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get nationality(): Country {
    return this._nationality;
  }

  set nationality(value: Country) {
    this._nationality = value;
  }

  get age(): number {
    return this._age;
  }

  set age(value: number) {
    this._age = value;
  }

  get statistics(): Statistics {
    return this._statistics;
  }

  set statistics(value: Statistics) {
    this._statistics = value;
  }

  get inventory(): Inventory {
    return this._inventory;
  }

  set inventory(value: Inventory) {
    this._inventory = value;
  }

  get attributes(): Attributes {
    return this._attributes;
  }

  set attributes(value: Attributes) {
    this._attributes = value;
  }

  get image(): string {
    return this._image;
  }

  set image(value: string) {
    this._image = value;
  }

  get tile(): ITile | undefined {
    return this._currentTile;
  }

  set tile(value: ITile | undefined) {
    this._currentTile = value;
  }

  get isPlayer(): boolean {
    return this._isPlayer;
  }

  get modelName(): string | undefined {
    return this._modelName;
  }

  set modelName(value: string | undefined) {
    this._modelName = value;
  }

  get modelPath(): string | undefined {
    return this._modelPath;
  }

  set modelPath(value: string | undefined) {
    this._modelPath = value;
  }

  public removeMovementPoints(value: number): void {
    this._attributes.removeMovement(value);
  }

  public resetMovementPoints(): void {
    this._attributes.resetMovement();
  }

  getStatsWithEffect(season: Season | undefined): Statistics {
    if (!season) season = Season.getAll()[0]; //fallback to the first season
    const stats = this.statistics.copy();
    for (const item of this.inventory.equippedItems.all) {
      const effect = item.getEffect(this, season);
      if (effect) {
        stats.addStat(effect);
      }
    }
    return stats;
  }
}
