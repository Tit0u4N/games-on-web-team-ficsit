import { TournamentModel } from '../model/TournamentModel.ts';

export class TournamentPresenter {
  private _tournamentModel: TournamentModel;

  constructor() {
    this._tournamentModel = new TournamentModel(this);
  }


}
