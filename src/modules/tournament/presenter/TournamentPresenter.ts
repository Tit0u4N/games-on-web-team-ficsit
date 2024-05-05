import { TournamentModel } from '../model/TournamentModel.ts';
import { Scene } from '@babylonjs/core';
import { DicePresenter } from '../../dice/presenter/DicePresenter.ts';

export class TournamentPresenter {
  private _tournamentModel: TournamentModel;
  private _scene: Scene;
  private _dicePresenter: DicePresenter;

  constructor(scene: Scene) {
    this._scene = scene;
    this._dicePresenter = new DicePresenter(scene);
    this._tournamentModel = new TournamentModel(this);
  }

  get tournamentModel(): TournamentModel {
    return this._tournamentModel;
  }

  get scene(): Scene {
    return this._scene;
  }

  get dicePresenter(): DicePresenter {
    return this._dicePresenter;
  }
}
