// CharacterBuilder.ts
import { Attributes } from '../model/Attributes';
import { Character } from '../model/Character';
import { Statistics } from '../model/Statistics';
import { Country } from '../../../core/Country.tsx';

export class CharacterBuilder {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _nationality: Country;
  private readonly _age: number;
  private readonly _image: string;
  private readonly _isPlayer: boolean = false;
  private _statistics: Statistics;
  private _attributes: Attributes;

  constructor(id: number, name: string, nationality: Country, age: number, image: string, isPlayer: boolean = false) {
    this._id = id;
    this._name = name;
    this._nationality = nationality;
    this._age = age;
    this._image = image;
    this._isPlayer = isPlayer;
    this._statistics = new Statistics();
    this._attributes = new Attributes(0, 0, false); // Default attributes, you can change it as needed
  }

  public setStatistics(statistics: Statistics): this {
    this._statistics = statistics;
    return this;
  }

  public setAttributes(attributes: Attributes): this {
    this._attributes = attributes;
    return this;
  }

  public build(): Character {
    const character = new Character(
      this._id,
      this._name,
      this._nationality,
      this._age,
      this._attributes,
      this._image,
      this._isPlayer,
    );
    if (this._statistics !== null) {
      character.statistics = this._statistics;
    }
    return character;
  }
}
