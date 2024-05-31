import { GameCorePresenter } from '@gamecore/presenter/GameCorePresenter.ts';
import { OlympicsModel } from '@/modules/olympics/model/OlympicsModel.ts';
import { TournamentPresenter } from '@tournament/presenter/TournamentPresenter.ts';
import { Sport } from '@core/singleton/Sport.ts';
import { TournamentDifficulty } from '@tournament/model/TournamentDifficulty.ts';

export class OlympicsPresenter {
  private readonly _gameCorePresenter: GameCorePresenter;
  private readonly _olympicsModel: OlympicsModel;
  private readonly _tournamentPresenterList: TournamentPresenter[] = [];
  private _tournamentNb: number = 0;

  constructor(gameCorePresenter: GameCorePresenter) {
    this._gameCorePresenter = gameCorePresenter;
    this._olympicsModel = new OlympicsModel(Array.from(this._gameCorePresenter.getCharacters()), this);
    this._tournamentPresenterList = this.createTournament();
  }

  createTournament(): TournamentPresenter[] {
    const tournamentPresenterList: TournamentPresenter[] = [];
    for (const sport of Sport.getAll()) {
      tournamentPresenterList.push(
        this._gameCorePresenter.tournamentManagerPresenter.createTournament(TournamentDifficulty.OLYMPIC, sport),
      );
    }
    return tournamentPresenterList;
  }

  get gameCorePresenter() {
    return this._gameCorePresenter;
  }

  get olympicsModel() {
    return this._olympicsModel;
  }

  getCurrentTournamentPresenter(): TournamentPresenter {
    return this._tournamentPresenterList[this._tournamentNb];
  }

  getNextTournament() {
    if (this._tournamentNb < this._tournamentPresenterList.length) {
      return this._tournamentPresenterList[this._tournamentNb];
    }
    return null;
  }

  isLastTournament() {
    return this._tournamentNb >= this._tournamentPresenterList.length;
  }

  incrementTournamentNb() {
    this._tournamentNb++;
  }

  getTeamRank() {
    return this._olympicsModel.getTeamRank();
  }
}
