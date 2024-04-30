import { Vector3 } from '@babylonjs/core';
import { Character } from 'data-structure-typed';
import { Sport } from '../../../core/singleton/Sport.ts';

export class TrainingCenterModel {
  private static readonly DEFAULT_ROTATION: number = 5;
  private _sports: Sport[];
  private _actualSport: Sport;
  private rotation: number;
  private _position: Vector3;
  private _name: string;
  private _character!: Character;

  constructor(sportType: Sport[], position: Vector3, name: string) {
    this._sports = sportType;
    this._position = position;
    this.rotation = TrainingCenterModel.DEFAULT_ROTATION;
    this._actualSport = this._sports[0];
    this._name = name;
  }

  public updateSport(): void {
    if (this.rotation > 0) {
      this.rotation--;
    } else {
      this.rotation = TrainingCenterModel.DEFAULT_ROTATION;
      const index = this._sports.indexOf(this._actualSport);
      this._actualSport = this._sports[(index + 1) % this._sports.length];
    }
  }

  get position(): Vector3 {
    return this._position;
  }

  set position(position: Vector3) {
    this._position = position;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get character(): Character {
    return this._character;
  }

  set character(character: Character) {
    this._character = character;
  }
}
