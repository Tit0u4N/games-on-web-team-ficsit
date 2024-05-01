import { TournamentFactory } from '../model/TournamentFactory.ts';
import { GameCorePresenter } from '../../gamecore/presenter/GameCorePresenter.ts';
import { TournamentDifficulty } from '../model/TournamentDifficulty.ts';
import { TournamentPresenter } from './TournamentPresenter.ts';
import { Character } from '../../character/model/Character.ts';

export class TournamentManagerPresenter {
  private readonly _gameCorePresenter: GameCorePresenter;
  private readonly _tournamentFactory: TournamentFactory;

  constructor(gameCorePresenter: GameCorePresenter) {
    this._gameCorePresenter = gameCorePresenter;
    this._tournamentFactory = new TournamentFactory(this);
  }

  get gameCorePresenter(): GameCorePresenter {
    return this._gameCorePresenter;
  }

  get tournamentFactory(): TournamentFactory {
    return this._tournamentFactory;
  }

  createTournament(tournamentDifficulty: TournamentDifficulty): TournamentPresenter {
    const tournamentModel = this._tournamentFactory.createTournament(tournamentDifficulty);
    return new TournamentPresenter(this._gameCorePresenter.babylonView.scene, this, tournamentModel);
  }

  generateNPCs(presentCharacters: Character[], numberNPCs: number): Character[] {
    return [];
  }
}
