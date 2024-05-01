import { TournamentModel } from './TournamentModel.ts';
import { TournamentDifficulty } from './TournamentDifficulty.ts';
import { TournamentManagerPresenter } from '../presenter/TournamentManagerPresenter.ts';
import { RewardModel } from './RewardModel.ts';

export class TournamentFactory {
  private readonly _tournamentManagerPresenter: TournamentManagerPresenter;

  constructor(tournamentManagerPresenter: TournamentManagerPresenter) {
    this._tournamentManagerPresenter = tournamentManagerPresenter;
  }

  createTournament(tournamentDifficulty: TournamentDifficulty): TournamentModel {
    const reward = this.generateReward();
    let nbRound = 1;
    let random: number;
    switch (tournamentDifficulty) {
      case TournamentDifficulty.REGIONAL: // 80% chance of 1 round, 20% chance of 2 rounds
        nbRound = Math.floor(Math.random() * 5) + 1 <= 4 ? 1 : 2;
        break;
      case TournamentDifficulty.NATIONAL: // 50% chance of 2 rounds, 30% chance of 3 rounds, 20% chance of 4 rounds
        random = Math.floor(Math.random() * 10) + 1;
        if (random <= 5) nbRound = 2;
        else if (random <= 8) nbRound = 3;
        else nbRound = 4;
        break;
      case TournamentDifficulty.INTERNATIONAL: // 3/14 chance of 3 rounds, 6/14 chance of 4 rounds, 5/14 chance of 5 rounds
        random = Math.floor(Math.random() * 14) + 1;
        if (random <= 3) nbRound = 3;
        else if (random <= 9) nbRound = 4;
        else nbRound = 5;
        break;
    }
    return new TournamentModel(this._tournamentManagerPresenter, tournamentDifficulty, nbRound, reward);
  }

  generateReward(): RewardModel {
    // TODO: Implement this method as needed
    return new RewardModel(undefined, 0);
  }
}
