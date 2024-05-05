import { Sport } from '../../../core/singleton/Sport.ts';
import { Vector3 } from '@babylonjs/core';
import { Character } from '../../character/model/Character.ts';
import { ArenaPresenter } from '../presenter/ArenaPresenter.ts';

export class ArenaModel {
  private static readonly DEFAULT_ROTATION: number = 5;
  private _sportType: Sport[];
  private _actualSport: Sport;
  private rotation: number;
  private _position: Vector3;
  private _roundWaiting: number;
  private _name: string;
  private _character!: Character;
  private _arenaPresenter!: ArenaPresenter;

  constructor(sportType: Sport[], position: Vector3, name: string) {
    this._sportType = sportType;
    this._position = position;
    this._roundWaiting = 0;
    this.rotation = ArenaModel.DEFAULT_ROTATION;
    this._actualSport = this._sportType[0];
    this._name = name;
  }

  public updateSport(): void {
    if (this.rotation > 0) {
      this.rotation--;
    } else {
      this.rotation = ArenaModel.DEFAULT_ROTATION;
      const index = this._sportType.indexOf(this._actualSport);
      this._actualSport = this._sportType[(index + 1) % this._sportType.length];
      this._arenaPresenter.updateTournament(this._actualSport);
    }
  }

  public startTournament(): void {
    this._arenaPresenter.tournamentPresenter.startTournament([this._character]);
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

  get arenaPresenter(): ArenaPresenter {
    return this._arenaPresenter;
  }

  set arenaPresenter(arenaPresenter: ArenaPresenter) {
    this._arenaPresenter = arenaPresenter;
  }
}
