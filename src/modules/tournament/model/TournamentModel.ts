import { Character } from '../../character/model/Character.ts';
import { TournamentManagerPresenter } from '../presenter/TournamentManagerPresenter.ts';
import { TournamentDifficulty } from './TournamentDifficulty.ts';
import { RewardModel } from './RewardModel.ts';

export class TournamentModel {
  private readonly _tournamentManagerPresenter: TournamentManagerPresenter;
  private readonly _reward: RewardModel;
  private readonly _numberRound: number;
  private readonly _difficulty: TournamentDifficulty;
  private _characters: Character[] = [];
  private _pools: Character[][] = [];
  private _finalRankings: Character[] = [];

  constructor(
    tournamentManagerPresenter: TournamentManagerPresenter,
    difficulty: TournamentDifficulty,
    numberRound: number,
    reward: RewardModel,
  ) {
    this._tournamentManagerPresenter = tournamentManagerPresenter;
    this._reward = reward;
    this._numberRound = numberRound;
    this._difficulty = difficulty;
  }

  get tournamentManagerPresenter(): TournamentManagerPresenter {
    return this._tournamentManagerPresenter;
  }

  get characters(): Character[] {
    return this._characters;
  }

  set characters(characters: Character[]) {
    this._characters = characters;
  }

  get reward(): RewardModel {
    return this._reward;
  }

  get numberRound(): number {
    return this._numberRound;
  }

  get difficulty(): TournamentDifficulty {
    return this._difficulty;
  }

  calculateScore(stat: number, diceRoll: number): number {
    return stat * 2 + diceRoll;
  }

  createPools() {
    const pools: Character[][] = [];
    const characters = this.characters;
    const nbPools = Math.ceil(characters.length / 8);
    for (let i = 0; i < nbPools; i++) {
      pools.push([]);
    }
    for (let i = 0; i < characters.length; i++) {
      pools[i % nbPools].push(characters[i]);
    }
    this._pools = pools;
  }

  playRoundInPool(poolNo: number) {
    const pool = this.pools[poolNo];
    const rankingOfThePool: { rank: number; character: Character }[] = [];
    for (let j = 0; j < pool.length; j++) {
      const character = pool[j];
      const ranking = Math.random() * 20; //TODO: die roll + calculate the ranking
      rankingOfThePool.push({ rank: ranking, character });
    }
    rankingOfThePool.sort((a, b) => a.rank - b.rank);
    if (this._pools.length > 1) {
      //add the last 4 to _finalRankings and remove them from the pool
      for (let i = 0; i < 4; i++) {
        const character = rankingOfThePool.pop();
        if (character) {
          this._finalRankings.push(character.character);
          pool.pop();
        }
      }
    }
  }

  get pools(): Character[][] {
    return this._pools;
  }

  get finalRankings(): Character[] {
    return this._finalRankings;
  }
}
