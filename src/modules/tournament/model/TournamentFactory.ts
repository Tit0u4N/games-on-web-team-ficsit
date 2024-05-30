import { TournamentModel } from './TournamentModel.ts';
import { TournamentDifficulty } from './TournamentDifficulty.ts';
import { TournamentManagerPresenter } from '../presenter/TournamentManagerPresenter.ts';
import { RewardModel } from './RewardModel.ts';
import { Sport } from '../../../core/singleton/Sport.ts';
import { ObjectRarity } from '../../object/model/ObjectRarity.ts';
import { getRandomUsableObject } from '../../object/model/UsableObject.ts';

export class TournamentFactory {
  private readonly _tournamentManagerPresenter: TournamentManagerPresenter;

  constructor(tournamentManagerPresenter: TournamentManagerPresenter) {
    this._tournamentManagerPresenter = tournamentManagerPresenter;
  }

  createTournament(tournamentDifficulty: TournamentDifficulty, sport: Sport): TournamentModel {
    const reward = this.generateRewards(tournamentDifficulty, sport);
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
      case TournamentDifficulty.INTERNATIONAL: // 7/20 chance of 3 rounds, 13/20 chance of 4 rounds
        random = Math.floor(Math.random() * 20) + 1;
        if (random <= 7) nbRound = 3;
        else nbRound = 4;
        break;
      case TournamentDifficulty.OLYMPIC:
        nbRound = 2;
        break;
    }
    return new TournamentModel(this._tournamentManagerPresenter, tournamentDifficulty, nbRound, sport, reward);
  }

  generateRewards(tournamentDifficulty: TournamentDifficulty, sport: Sport): RewardModel[] {
    const rewards: RewardModel[] = [];
    switch (tournamentDifficulty) {
      case TournamentDifficulty.REGIONAL:
        rewards.push(this.generateReward(1, sport, ObjectRarity.UNCOMMON));
        rewards.push(this.generateReward(4, sport, ObjectRarity.COMMON));
        break;
      case TournamentDifficulty.NATIONAL:
        rewards.push(this.generateReward(1, sport, ObjectRarity.RARE));
        rewards.push(this.generateReward(4, sport, ObjectRarity.UNCOMMON));
        rewards.push(this.generateReward(8, sport, ObjectRarity.COMMON));
        break;
      case TournamentDifficulty.INTERNATIONAL:
        rewards.push(this.generateReward(1, sport, ObjectRarity.RARE));
        rewards.push(this.generateReward(4, sport, ObjectRarity.RARE, true));
        rewards.push(this.generateReward(8, sport, ObjectRarity.UNCOMMON));
        rewards.push(this.generateReward(12, sport, ObjectRarity.COMMON));
        break;
      case TournamentDifficulty.OLYMPIC:
        break;
    }
    return rewards;
  }

  generateReward(
    rankToReach: number,
    sport: Sport,
    rarity: ObjectRarity,
    keepIfBetterReward: boolean = false,
  ): RewardModel {
    return new RewardModel(getRandomUsableObject(rarity, sport), rankToReach, keepIfBetterReward);
  }
}
