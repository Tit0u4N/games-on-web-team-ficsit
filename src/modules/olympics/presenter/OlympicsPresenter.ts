import { GameCorePresenter } from '@gamecore/presenter/GameCorePresenter.ts';
import { OlympicsModel } from '@/modules/olympics/model/OlympicsModel.ts';

export class OlympicsPresenter {
  private readonly _gameCorePresenter: GameCorePresenter;
  private readonly _olympicsModel: OlympicsModel;

  constructor(gameCorePresenter: GameCorePresenter) {
    this._gameCorePresenter = gameCorePresenter;
    this._olympicsModel = new OlympicsModel(Array.from(this._gameCorePresenter.getCharacters()), this);
  }

  get gameCorePresenter() {
    return this._gameCorePresenter;
  }

  get olympicsModel() {
    return this._olympicsModel;
  }
}
