import { TournamentPresenter } from '../presenter/TournamentPresenter.ts';
import { CharacterPresenter } from '../../character/presenter/CharacterPresenter.ts';

export class TournamentModel {
  private _tournamentPresenter: TournamentPresenter;
  private _characters: CharacterPresenter[] = [];

  constructor(tournamentPresenter: TournamentPresenter) {
    this._tournamentPresenter = tournamentPresenter;
  }

  get tournamentPresenter(): TournamentPresenter {
    return this._tournamentPresenter;
  }

  get characters(): CharacterPresenter[] {
    return this._characters;
  }
}
