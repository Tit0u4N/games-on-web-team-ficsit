import { SportType } from '../../sport/model/Sport.ts';
import { Vector3 } from '@babylonjs/core';

export class Building {
  private static DEFAULT_ROTATION: number = 5;
  private _sportType: SportType[];
  private _actualSport: SportType;
  private rotation: number;
  private _position: Vector3;
  private _roundWaiting: number;

  constructor(sportType: SportType[], position: Vector3) {
    this._sportType = sportType;
    this._position = position;
    this._roundWaiting = 0;
    this.rotation = Building.DEFAULT_ROTATION;
    this._actualSport = this._sportType[0];
  }

  public update() {
    if (this.rotation > 0) {
      this.rotation--;
    } else {
      this.rotation = Building.DEFAULT_ROTATION;
      const index = this._sportType.indexOf(this._actualSport);
      this._actualSport = this._sportType[(index + 1) % this._sportType.length];
    }
  }

  get sportType(): SportType[] {
    return this._sportType;
  }

  set sportType(sportType: SportType[]) {
    this._sportType = sportType;
  }

  get position(): Vector3 {
    return this._position;
  }

  set position(position: Vector3) {
    this._position = position;
  }

  get roundWaiting(): number {
    return this._roundWaiting;
  }

  set roundWaiting(roundWaiting: number) {
    this._roundWaiting = roundWaiting;
  }
}
