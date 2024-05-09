import { Character } from '../../character/model/Character.ts';
import { TournamentManagerPresenter } from '../presenter/TournamentManagerPresenter.ts';
import { TournamentDifficulty } from './TournamentDifficulty.ts';
import { RewardModel } from './RewardModel.ts';
import { Sport } from '../../../core/singleton/Sport.ts';
import { Season } from '../../../core/singleton/Season.ts';

export class TournamentModel {
  private readonly _tournamentManagerPresenter: TournamentManagerPresenter;
  private readonly _reward: RewardModel;
  private readonly _numberRound: number;
  private readonly _difficulty: TournamentDifficulty;
  private readonly _sport: Sport;
  private _isTournamentStarted: boolean = false;
  private _season: Season | undefined;
  private _characters: Character[] = [];
  private _pools: Character[][] = [];
  private _finalRankings: Character[] = [];
  private _isInPool: boolean = false;

  constructor(
    tournamentManagerPresenter: TournamentManagerPresenter,
    difficulty: TournamentDifficulty,
    numberRound: number,
    sport: Sport,
    reward: RewardModel,
  ) {
    this._tournamentManagerPresenter = tournamentManagerPresenter;
    this._reward = reward;
    this._numberRound = numberRound;
    this._difficulty = difficulty;
    this._sport = sport;
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

  get isTournamentStarted(): boolean {
    return this._isTournamentStarted;
  }

  initTournament() {
    this._season = this.tournamentManagerPresenter.gameCorePresenter.getCurrentSeason();
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
      const ranking = this.calculateScore(
        character.getStatsWithEffect(this._season).get(this._sport),
        Math.floor(Math.random() * 20),
      );
      rankingOfThePool.push({ rank: ranking, character });
      console.log(ranking, character.name);
    }
    rankingOfThePool.sort((a, b) => b.rank - a.rank);
    if (this._pools.length == 1) {
      //add all the characters to _finalRankings in the inverse order of rankingOfThePool
      for (let i = rankingOfThePool.length - 1; i >= 0; i--) {
        const character = rankingOfThePool[i].character;
        this._finalRankings.push(character);
      }
    } else {
      //add the last 4 to _finalRankings and remove them from the pool
      for (let i = 0; i < 4; i++) {
        const character = rankingOfThePool.pop();
        if (character) {
          this._finalRankings.push(character.character);
          pool.pop();
        }
      }
    }
    console.log(rankingOfThePool);
    console.log(this._finalRankings);
  }

  get pools(): Character[][] {
    return this._pools;
  }

  get finalRankings(): Character[] {
    return this._finalRankings;
  }

  get isInPool(): boolean {
    return this._isInPool;
  }
}
