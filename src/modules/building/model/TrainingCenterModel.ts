import { Scene, Vector3 } from '@babylonjs/core';
import { Character } from 'data-structure-typed';
import { Sport } from '../../../core/singleton/Sport.ts';
import { DicePresenter } from '../../dice/presenter/DicePresenter.ts';

export class TrainingCenterModel {
  private static readonly DEFAULT_ROTATION: number = 8;
  private _sports: Sport[];
  private _actualSport: Sport;
  private rotation: number;
  private _position: Vector3;
  private _name: string;
  private _diceRoundPresenter: DicePresenter;
  private _diceStatsPresenter: DicePresenter;
  private _diceStatsScore!: number;
  private _diceRoundScore!: number;

  constructor(scene: Scene, sportType: Sport[], position: Vector3, name: string) {
    this._diceRoundPresenter = new DicePresenter(scene);
    this._diceStatsPresenter = new DicePresenter(scene);
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

  public getEffect(character: Character): void {}

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

  get diceRoundPresenter(): DicePresenter {
    return this._diceRoundPresenter;
  }

  get diceStatsPresenter(): DicePresenter {
    return this._diceStatsPresenter;
  }

  get diceStatsScore(): number {
    return this._diceStatsScore;
  }

  set diceStatsScore(diceStatsScore: number) {
    this._diceStatsScore = diceStatsScore;
  }

  get diceRoundScore(): number {
    return this._diceRoundScore;
  }

  set diceRoundScore(diceRoundScore: number) {
    this._diceRoundScore = diceRoundScore;
  }
}
