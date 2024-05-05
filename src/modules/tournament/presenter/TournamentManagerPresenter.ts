import { TournamentFactory } from '../model/TournamentFactory.ts';
import { GameCorePresenter } from '../../gamecore/presenter/GameCorePresenter.ts';
import { TournamentDifficulty } from '../model/TournamentDifficulty.ts';
import { TournamentPresenter } from './TournamentPresenter.ts';
import { Character } from '../../character/model/Character.ts';
import { Sport } from '../../../core/singleton/Sport.ts';

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

  createTournament(tournamentDifficulty: TournamentDifficulty, sport: Sport): TournamentPresenter {
    const tournamentModel = this._tournamentFactory.createTournament(tournamentDifficulty, sport);
    return new TournamentPresenter(this._gameCorePresenter.babylonView.scene, this, tournamentModel);
  }

  generateNPCs(presentCharacters: Character[], numberNPCs: number, difficulty: TournamentDifficulty): Character[] {
    let totalStats = 0;
    let minStats = 0;
    switch (difficulty) {
      case TournamentDifficulty.REGIONAL:
        totalStats = 80;
        minStats = 4;
        break;
      case TournamentDifficulty.NATIONAL:
        totalStats = 100;
        minStats = 6;
        break;
      case TournamentDifficulty.INTERNATIONAL:
        totalStats = 120;
        minStats = 8;
        break;
    }
    const nbNPCToGen = numberNPCs - presentCharacters.length;
    for (let i = 0; i < nbNPCToGen; i++) {
      presentCharacters.push(this._gameCorePresenter.characterPresenter.generateNPC(totalStats, minStats));
    }
    return presentCharacters;
  }

  static generateDifficulty(): TournamentDifficulty {
    const random = Math.floor(Math.random() * 7);
    if (random < 4) {
      // 1/2 chance
      return TournamentDifficulty.REGIONAL;
    } else if (random < 6) {
      // 1/4 chance
      return TournamentDifficulty.NATIONAL;
    } else {
      // 1/8 chance
      return TournamentDifficulty.INTERNATIONAL;
    } //
  }
}
