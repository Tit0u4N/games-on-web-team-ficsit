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
  private _rounds: { round: number; pools: { rank: number; character: Character }[][] }[] = [];
  private _finalRankings: Character[] = [];
  private _isInPool: boolean = false;
  private _currentPool: number = 0;
  private _currentRound: number = 0;

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
    this._rounds = [];
    const lastRound: { rank: number; character: Character }[][] = [];
    lastRound.push([]);
    this._rounds.push({ round: this._numberRound - 1, pools: lastRound });
    for (let i = 1; i < this._numberRound; i++) {
      const pools: { rank: number; character: Character }[][] = [];
      for (let j = 0; j < Math.pow(2, i); j++) {
        pools.push([]);
      }
      this._rounds.push({ round: this._numberRound - i - 1, pools: pools });
      this._currentRound = this._numberRound - i - 1;
    }
    const firstRound = this._rounds.find((round) => round.round == 0);
    const nbPools = firstRound?.pools.length || 0;
    const characters = this.characters;
    for (let i = 0; i < characters.length; i++) {
      firstRound?.pools[i % nbPools].push({ rank: -1, character: characters[i] });
    }
    this._isTournamentStarted = true;
  }

  playRoundInPool(poolNo: number) {
    const currentRound = this._rounds.find((round) => round.round == this._currentRound);
    const pool = currentRound?.pools[poolNo];
    const rankingOfThePool: { rank: number; character: Character }[] = [];
    for (let j = 0; j < pool!.length; j++) {
      const character = pool![j].character;
      const ranking = this.calculateScore(
        character.getStatsWithEffect(this._season).get(this._sport),
        Math.floor(Math.random() * 20),
      );
      rankingOfThePool.push({ rank: ranking, character });
    }
    rankingOfThePool.sort((a, b) => b.rank - a.rank);
    if (currentRound?.pools.length == 1) {
      //add all the characters to _finalRankings in the inverse order of rankingOfThePool
      for (let i = rankingOfThePool.length - 1; i >= 0; i--) {
        const character = rankingOfThePool[i].character;
        this._finalRankings.push(character);
        currentRound!.pools[poolNo][i].rank = i;
      }
    } else {
      for (let i = 0; i < rankingOfThePool.length; i++) {
        currentRound!.pools[poolNo].find((value) => value.character.id == rankingOfThePool[i].character.id)!.rank = i;
      }
      //add the first half of the rankingOfThePool to the next pool
      for (let i = 0; i < currentRound!.pools[poolNo].length / 2; i++) {
        this._rounds
          .find((round) => round.round == this._currentRound + 1)!
          .pools[Math.floor(poolNo / 2)].push({ rank: -1, character: currentRound!.pools[poolNo][i].character });
      }
    }
  }

  get rounds(): { round: number; pools: { rank: number; character: Character }[][] }[] {
    return this._rounds;
  }

  get finalRankings(): Character[] {
    return this._finalRankings;
  }

  get isInPool(): boolean {
    return this._isInPool;
  }

  get currentRound(): number {
    return this._currentRound;
  }

  getCurrentRound() {
    return this._rounds.find((round) => round.round == this._currentRound);
  }

  get currentPool(): number {
    return this._currentPool;
  }

  playNextRound() {
    this.playRoundInPool(this._currentPool);
    if (this.getCurrentRound()!.pools.length > this._currentPool + 1) this._currentPool++;
    else {
      if (this._currentRound == this._numberRound - 1) {
        this._isTournamentStarted = false;
      } else {
        this._currentRound++;
        this._currentPool = 0;
      }
    }
  }

  playNextPool() {
    this._currentPool++;
  }
}
