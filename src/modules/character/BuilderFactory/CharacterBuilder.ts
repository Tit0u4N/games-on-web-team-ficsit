// CharacterBuilder.ts
import { Attributes } from '../model/Attributes';
import { Character } from '../model/Character';
import { Statistics } from '../model/Statistics';
import { Inventory } from '../../inventory/model/Inventory.ts';

export class CharacterBuilder {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _nationality: string;
  private readonly _age: number;
  private readonly _image: string;
  private _statistics: Statistics;
  private _inventory: Inventory;
  private _attributes: Attributes;

  constructor(id: number, name: string, nationality: string, age: number, image: string) {
    this._id = id;
    this._name = name;
    this._nationality = nationality;
    this._age = age;
    this._image = image;
    this._statistics = new Statistics();
    this._inventory = new Inventory();
    this._attributes = new Attributes(0, 0, false); // Default attributes, you can change it as needed
  }

  public setStatistics(statistics: Statistics): this {
    this._statistics = statistics;
    return this;
  }

  public setInventory(inventory: Inventory): this {
    this._inventory = inventory;
    return this;
  }

  public setAttributes(attributes: Attributes): this {
    this._attributes = attributes;
    return this;
  }

  public build(): Character {
    return new Character(this._id, this._name, this._nationality, this._age, this._attributes, this._image);
  }
}
