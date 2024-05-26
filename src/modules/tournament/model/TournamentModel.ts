import { Character } from '../../character/model/Character.ts';
import { TournamentManagerPresenter } from '../presenter/TournamentManagerPresenter.ts';
import { TournamentDifficulty } from './TournamentDifficulty.ts';
import { RewardModel } from './RewardModel.ts';
import { Sport } from '../../../core/singleton/Sport.ts';
import { Season } from '../../../core/singleton/Season.ts';
import { ModalManager } from '../../../core/singleton/ModalManager.ts';

export class TournamentModel {
  private readonly _tournamentManagerPresenter: TournamentManagerPresenter;
  private readonly _reward: RewardModel;
  private readonly _numberRound: number;
  private readonly _difficulty: TournamentDifficulty;
  private readonly _sport: Sport;
  private _season: Season | undefined;
  private _characters: Character[] = [];
  private _rounds: { round: number; pools: { rank: number; character: Character }[][] }[] = [];
  private _finalRankings: { rank: number; character: Character }[] = [];
  private _currentPool: number = 0;
  private _currentRound: number = 0;
  private _currentPoolRolls: { diceRoll: number; character: Character; rank: number }[] = [];
  private _tournamentStatus: 'notStarted' | 'inProgress' | 'inPool' | 'finished' = 'notStarted';
  private _isRolled: boolean = false;

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
    //TODO: tiredness
    return stat * 2 + diceRoll;
  }

  get tournamentStatus(): 'notStarted' | 'inProgress' | 'inPool' | 'finished' {
    return this._tournamentStatus;
  }

  get isRolled(): boolean {
    return this._isRolled;
  }

  get rounds(): { round: number; pools: { rank: number; character: Character }[][] }[] {
    return this._rounds;
  }

  get finalRankings() {
    return this._finalRankings;
  }

  get currentRound(): number {
    return this._currentRound;
  }

  getCurrentRound() {
    return this._rounds.find((round) => round.round == this._currentRound);
  }

  getCurrentPool() {
    return this.getCurrentRound()!.pools[this._currentPool];
  }

  get currentPool(): number {
    return this._currentPool;
  }

  get currentPoolRolls(): { diceRoll: number; character: Character; rank: number }[] {
    return this._currentPoolRolls;
  }

  get sport(): Sport {
    return this._sport;
  }

  public isUserRolledDice(characterId: number): boolean {
    return this.currentPoolRolls.find((value) => value.character.id == characterId)!.diceRoll != -1;
  }

  isAllRolled() {
    return this._currentPoolRolls.every((value) => value.diceRoll != -1);
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
    this._tournamentStatus = 'inProgress';
  }

  playRoundInPool(poolNo: number) {
    const currentRound = this._rounds.find((round) => round.round == this._currentRound);
    const pool = currentRound?.pools[poolNo];
    const rankingOfThePool: { rank: number; character: Character }[] = [];
    for (let j = 0; j < pool!.length; j++) {
      const character = pool![j].character;
      //TODO: tiredness
      const ranking = this.calculateScore(
        character.getStatsWithEffect(this._season).get(this._sport),
        Math.floor(Math.random() * 20) + 1,
      );
      rankingOfThePool.push({ rank: ranking, character });
    }
    rankingOfThePool.sort((a, b) => b.rank - a.rank);
    if (currentRound?.pools.length == 1) {
      //add all the characters to _finalRankings in the inverse order of rankingOfThePool
      for (let i = rankingOfThePool.length - 1; i >= 0; i--) {
        currentRound!.pools[poolNo][i].rank = i;
      }
    } else {
      for (let i = 0; i < rankingOfThePool.length; i++) {
        currentRound!.pools[poolNo].find((value) => value.character.id == rankingOfThePool[i].character.id)!.rank = i;
      }
      currentRound!.pools[poolNo].sort((a, b) => a.rank - b.rank);
      //add the first half of the rankingOfThePool to the next pool
      for (let i = 0; i < currentRound!.pools[poolNo].length / 2; i++) {
        this._rounds
          .find((round) => round.round == this._currentRound + 1)!
          .pools[Math.floor(poolNo / 2)].push({ rank: -1, character: currentRound!.pools[poolNo][i].character });
      }
    }
  }

  playNextRound() {
    if (this._tournamentStatus === 'finished') {
      ModalManager.getInstance().updateCurrentModal();
      return;
    }
    this._isRolled = false;
    if (this.currentPoolContainsCharacter()) {
      this._tournamentStatus = 'inPool';
      this._currentPoolRolls = [];
      for (let i = 0; i < this.getCurrentPool()!.length; i++) {
        this._currentPoolRolls.push({
          diceRoll: !this.getCurrentPool()![i].character.isPlayer ? Math.floor(Math.random() * 20) + 1 : -1,
          character: this.getCurrentPool()![i].character,
          rank: -1,
        });
      }
    }
    if (this._tournamentStatus !== 'inPool') {
      this.playRoundInPool(this._currentPool);
      this.passToNextRound();
    }
  }

  public passToNextRound() {
    this._tournamentStatus = 'inProgress';
    if (this.getCurrentRound()!.pools.length > this._currentPool + 1) this._currentPool++;
    else {
      if (this._currentRound != this._numberRound - 1) {
        this._currentRound++;
        this._currentPool = 0;
      } else {
        this.endTournament();
        //TODO: add reward + tiredness
      }
    }
    ModalManager.getInstance().updateCurrentModal();
  }

  private endTournament() {
    this._tournamentStatus = 'finished';
    this._finalRankings = [];
    this.getCurrentPool()!.sort((a, b) => a.rank - b.rank);
    this.getCurrentPool()!.forEach((value) => {
      this._finalRankings.push(value);
    });
    console.log(this._currentRound);
    for (let i = this._currentRound - 1; i >= 0; i--) {
      const currentRound = this._rounds.find((round) => round.round == i);
      currentRound!.pools.forEach((pool) => {
        pool.sort((a, b) => a.rank - b.rank);
        for (let j = 0; j < pool.length / 2; j++) {
          const copy = pool[j + 4];
          const currentRank = 8 + (copy.rank - 4) + (this.numberRound - i - 2) * 4;
          this._finalRankings.push({ rank: currentRank, character: copy.character });
        }
      });
    }
    this._finalRankings.sort((a, b) => a.rank - b.rank);
  }

  private currentPoolContainsCharacter(): boolean {
    const characters = this._tournamentManagerPresenter.gameCorePresenter.characterPresenter.characters;
    const characterArray = Array.from(characters);
    const currentPool = this.getCurrentRound()!.pools[this._currentPool]!;
    return characterArray.some((character) => currentPool.some((pool) => pool.character.id === character.id));
  }

  setCurrentPoolRoll(characterId: number, diceRoll: number) {
    this._currentPoolRolls.find((value) => value.character.id == characterId)!.diceRoll = diceRoll;
    this._isRolled = true;
    if (this.isAllRolled()) this.rankCurrentPool();
    ModalManager.getInstance().updateCurrentModal();
  }

  private rankCurrentPool() {
    const currentPool = this.getCurrentPool()!;
    const currentPoolRolls = this._currentPoolRolls;
    const currentRound = this.getCurrentRound();
    const rankingOfThePool: { rank: number; character: Character }[] = [];
    for (let j = 0; j < currentPoolRolls!.length; j++) {
      const character = currentPoolRolls![j].character;
      //TODO: tiredness
      const ranking = this.calculateScore(
        character.getStatsWithEffect(this._season).get(this._sport),
        currentPoolRolls![j].diceRoll,
      );
      rankingOfThePool.push({ rank: ranking, character });
    }
    rankingOfThePool.sort((a, b) => b.rank - a.rank);
    if (currentRound?.pools.length == 1) {
      //add all the characters to _finalRankings in the inverse order of rankingOfThePool
      for (let i = rankingOfThePool.length - 1; i >= 0; i--) {
        const character = rankingOfThePool[i].character;
        currentPool.find((value) => value.character.id == rankingOfThePool[i].character.id)!.rank = i;
        currentPoolRolls.find((value) => value.character.id == character.id)!.rank = i;
      }
    } else {
      for (let i = 0; i < rankingOfThePool.length; i++) {
        currentPool.find((value) => value.character.id == rankingOfThePool[i].character.id)!.rank = i;
        currentPoolRolls.find((value) => value.character.id == rankingOfThePool[i].character.id)!.rank = i;
      }
      currentPool.sort((a, b) => a.rank - b.rank);
      //add the first half of the rankingOfThePool to the next pool
      for (let i = 0; i < currentPool.length / 2; i++) {
        this._rounds
          .find((round) => round.round == this._currentRound + 1)!
          .pools[
            Math.floor(this._currentPool / 2)
          ].push({ rank: -1, character: currentRound!.pools[this._currentPool][i].character });
      }
    }
  }
}
