import { SportType } from '../../sport/model/Sport.ts';
import { Vector3 } from '@babylonjs/core';
import { Character } from 'data-structure-typed';
import { TournamentPresenter } from '../../tournament/presenter/TournamentPresenter.ts';

export class ArenaModel {
  private static readonly DEFAULT_ROTATION: number = 5;
  private _sportType: SportType[];
  private _actualSport: SportType;
  private rotation: number;
  private _position: Vector3;
  private _roundWaiting: number;
  private _tournamentPresenter: TournamentPresenter | null;
  private _name: string;
  private _character!: Character;

  constructor(sportType: SportType[], position: Vector3, name: string, tournamentPresenter?: TournamentPresenter) {
    this._sportType = sportType;
    this._position = position;
    this._roundWaiting = 0;
    this.rotation = ArenaModel.DEFAULT_ROTATION;
    this._actualSport = this._sportType[0];
    this._name = name;
    this._tournamentPresenter = tournamentPresenter || null;
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
    // todo
    const win: boolean = true;
    if (win) {
      console.log('The winner is ' + this._name);
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

  get tournament(): TournamentPresenter | null{
    return this._tournamentPresenter;
  }

  set tournament(tournament: TournamentPresenter | null) {
    this._tournamentPresenter = tournament;
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

  // Method
  hasTournament(): boolean {
    // todo add tournament condition
    return !!this._tournamentPresenter;
  }
}
