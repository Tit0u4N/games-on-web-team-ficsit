import { Sport } from '../../../core/singleton/Sport.ts';
import { Vector3 } from '@babylonjs/core';
import { Tournament } from '../../tournement/model/Tournament.ts';
import { Character } from 'data-structure-typed';

export class ArenaModel {
  private static readonly DEFAULT_ROTATION: number = 5;
  private _sportType: Sport[];
  private _actualSport: Sport;
  private rotation: number;
  private _position: Vector3;
  private _roundWaiting: number;
  private _tournament: Tournament;
  private _name: string;
  private _character!: Character;

  constructor(sportType: Sport[], position: Vector3, name: string, tournament: Tournament) {
    this._sportType = sportType;
    this._position = position;
    this._roundWaiting = 0;
    this.rotation = ArenaModel.DEFAULT_ROTATION;
    this._actualSport = this._sportType[0];
    this._name = name;
    this._tournament = tournament;
  }

  public updateSport(): void {
    if (this.rotation > 0) {
      this.rotation--;
    } else {
      this.rotation = ArenaModel.DEFAULT_ROTATION;
      const index = this._sportType.indexOf(this._actualSport);
      this._actualSport = this._sportType[(index + 1) % this._sportType.length];
    }
  }

  public startTournament(): void {
    const win: boolean = this._tournament.startTournament();
    if (win) {
      console.log('The winner is ' + this._name);
    }
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

  get tournament(): Tournament {
    return this._tournament;
  }

  set tournament(tournament: Tournament) {
    this._tournament = tournament;
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
