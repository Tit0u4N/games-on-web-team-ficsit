// CharacterBuilder.ts
import { Attributes } from '@character/model/Attributes';
import { Character } from '@character/model/Character';
import { Statistics } from '@character/model/Statistics';
import { Country } from '@core/Country.tsx';

export class CharacterBuilder {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _nationality: Country;
  private readonly _age: number;
  private readonly _image: string;
  private readonly _isPlayer: boolean = false;
  private _statistics: Statistics;
  private _attributes: Attributes;
  private readonly _modelName?: string;
  private readonly _modelPath?: string;

  constructor(id: number,
              name: string,
              nationality: Country,
              age: number,
              image: string,
              isPlayer: boolean = false,
              modelName?: string,
              modelPath?: string
  ) {
    this._id = id;
    this._name = name;
    this._nationality = nationality;
    this._age = age;
    this._image = image;
    this._isPlayer = isPlayer;
    this._statistics = new Statistics();
    this._attributes = new Attributes(0, 0, false); // Default attributes, you can change it as needed
    this._modelName = modelName;
    this._modelPath = modelPath;
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
    if (this._modelName !== undefined && this._modelPath !== undefined) {
      character.modelName = this._modelName;
      character.modelPath = this._modelPath;
    }
    if (this._statistics !== null) {
      character.statistics = this._statistics;
    }
    return character;
  }
}
