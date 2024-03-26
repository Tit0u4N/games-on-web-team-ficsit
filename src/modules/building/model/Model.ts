import { SportType } from '../../sport/model/Sport.ts';
import { Vector3 } from '@babylonjs/core';

export class Building {
  private _sportType: SportType;
  private _position: Vector3;
  private _roundWaiting: number;

  constructor(sportType: SportType, position: Vector3) {
    this._sportType = sportType;
    this._position = position;
    this._roundWaiting = 0;
  }

  get sportType(): SportType {
    return this._sportType;
  }

  set sportType(sportType: SportType) {
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
