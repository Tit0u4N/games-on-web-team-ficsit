import { Scene, Vector3 } from '@babylonjs/core';
import { Sport } from '../../../core/singleton/Sport.ts';
import { DicePresenter } from '../../dice/presenter/DicePresenter.ts';
import { Character } from '../../character/model/Character.ts';
import { config } from '../../../core/Interfaces.ts';
import { Statistics } from '../../character/model/Statistics.ts';
import { MapPresenter } from '../../map/presenter/MapPresenter.ts';
import { TypesTile } from '../../map/model/TileModel.ts';

interface ICharacterEffect {
  character: Character;
  sports: Sport[];
  rounds: number;
  stats: number;
}

export class TrainingCenterModel {
  private static readonly DEFAULT_ROTATION: number = config.building.trainingCenterModel.defaultRotation;
  private readonly tileX: number;
  private readonly tileY: number;
  private readonly mapPresenter: MapPresenter;
  private _sports!: Sport[];
  private rotation: number;
  private _position: Vector3;
  private _name: string;
  private readonly _diceRoundPresenter: DicePresenter;
  private readonly _diceStatsPresenter: DicePresenter;
  private _diceStatsScore!: number;
  private _diceRoundScore!: number;
  private _characters!: ICharacterEffect[];

  /**
   * Creates a new instance of the TrainingCenterModel class.
   *
   * @param {MapPresenter} mapPresenter - The MapPresenter instance.
   * @param {Scene} scene - The BABYLON.Scene instance.
   * @param {number} tileX - The x position of the training center in the GraphTileModel
   * @param {number} tileY - The y position of the training center in the GraphTileModel
   * @param {Vector3} position - The position of the training center in the 3D scene.
   * @param {string} name - The name of the training center.
   */
  constructor(mapPresenter: MapPresenter, scene: Scene, tileX: number, tileY: number, position: Vector3, name: string) {
    this.tileX = tileX;
    this.tileY = tileY;
    this.mapPresenter = mapPresenter;
    this._diceRoundPresenter = new DicePresenter(scene);
    this._diceStatsPresenter = new DicePresenter(scene);
    this._position = position;
    this.rotation = TrainingCenterModel.DEFAULT_ROTATION;
    this._name = name;
  }

  /**
   * Initializes the training center by determining the available sports based on the current season.
   * This function should be called after the training center is created and the view is initialized.
   */
  public initialize(): void {
    this._sports = this.getSports();
    this._characters = [];
  }

  /**
   * Determines the sports available at the training center based on the current position's season.
   *
   * @returns {Sport[]} An array of sports available at the training center.
   *
   * This function works by first determining the number of sports to be selected randomly.
   * Then, it identifies the current seasons based on the training center's position.
   * After that, it filters the sports that are relevant to the current seasons.
   * Finally, it selects the specified number of sports randomly from the filtered list, ensuring no duplicates.
   */
  private getSports(): Sport[] {
    // Get a random number between 1 and the number of sports
    const numberOfSportsSelected = Math.floor(Math.random() * Sport.getAll().length) + 1;
    // Get the seasons
    const seasons = this.getSeasonByPosition();
    // Select the number of sport randomly and not repeat them
    const sportsBySeason: Sport[] = [];
    seasons.forEach((season) => {
      sportsBySeason.push(...Sport.getBySeason(season));
    });
    const sports: Sport[] = [];
    for (let i = 0; i < numberOfSportsSelected; i++) {
      const randomSport = sportsBySeason[Math.floor(Math.random() * sportsBySeason.length)];
      if (!sports.includes(randomSport))
        sports.push(randomSport);
    }
    return sports;
  }

  /**
   * Determines the season based on the tile type and its neighboring tiles.
   *
   * @returns {string[]} An array of seasons representing the current season at the tile's position.
   *
   * This function works by assigning weights to different tile types and calculating the total weight of neighboring tiles.
   * Based on the total weight, it determines the season. The weights are assigned as follows:
   *
   * - TypesTile.SNOW: 2
   * - TypesTile.MOUNTAIN: 2
   * - TypesTile.FOREST: 1
   * - TypesTile.GRASS: 0
   * - TypesTile.SAND: -1
   * - TypesTile.WATER: -2
   * - TypesTile.DEEP_WATER: -2
   * - TypesTile.HILL_GRASS: 1
   * - TypesTile.HILL_FOREST: 1
   * - TypesTile.HILL_SAND: 0
   *
   * The total weight is then used to determine the season:
   *
   * - totalWeight <= -3: Summer
   * - totalWeight >= 3: Winter
   * - -3 < totalWeight < -1: Autumn
   * - 1 < totalWeight < 3: Spring
   * - Otherwise: A mix of Spring and Autumn or a transitional period
   */
  private getSeasonByPosition(): string[] {
    const tile = this.mapPresenter.getDisplacementGraph().getTile(this.tileX, this.tileY);
    const neighbors = this.mapPresenter.getDisplacementGraph().getAdjacentTiles(tile!);

    type TileWeights = {
      [key in TypesTile]?: number;
    };

    // Assign weights to different tile types
    const weights: TileWeights = {
      [TypesTile.SNOW]: 2,
      [TypesTile.MOUNTAIN]: 2,
      [TypesTile.FOREST]: 1,
      [TypesTile.GRASS]: 0,
      [TypesTile.SAND]: -1,
      [TypesTile.WATER]: -2,
      [TypesTile.DEEP_WATER]: -2,
      [TypesTile.HILL_GRASS]: 1,
      [TypesTile.HILL_FOREST]: 1,
      [TypesTile.HILL_SAND]: 0,
    };

    // Calculate the total weight of neighboring tiles
    const totalWeight = neighbors.reduce((sum, neighbor) => sum + (weights[neighbor.type] || 0), 0);

    // Determine the season based on the total weight
    if (totalWeight <= -3) {
      return ['SUMMER'];
    } else if (totalWeight >= 3) {
      return ['WINTER'];
    } else if (totalWeight > -3 && totalWeight < -1) {
      return ['AUTUMN'];
    } else if (totalWeight > 1 && totalWeight < 3) {
      return ['SPRING'];
    } else {
      // If the total weight is close to 0, the season could be a mix of Spring and Autumn or a transitional period
      return ['SPRING', 'AUTUMN'];
    }
  }


  /**
   * Advances the training center to the next round and updates the characters' stats accordingly.
   *
   * This function performs the following actions:
   * 1. Iterates through each character in the training center.
   * 2. Decrements the remaining rounds for each character.
   * 3. If a character has no more rounds left, adds the trained sport stats to the character's statistics.
   * 4. Filters out characters that have no more rounds, effectively removing them from the training center.
   * 5. Decrements the rotation value of the training center.
   * 6. If the rotation value is less than 0, resets it to the default rotation value and updates the available sports.
   */
  public nextRound(): void {
    // for each character in the training center
    this._characters.forEach((characterEffect: ICharacterEffect) => {
      // remove one round from the character
      characterEffect.rounds--;
      // if the character has no more rounds
      if (characterEffect.rounds === 0) {
        // for each sport stats add the stats to the character
        for (const sport of characterEffect.sports) {
          const statistic = new Map<Sport, number>();
          statistic.set(sport, characterEffect.stats);
          characterEffect.character.statistics.addStat(new Statistics(statistic));
        }
      }
    });
    // remove all characters that have no more rounds
    this._characters = this._characters.filter((characterEffect: ICharacterEffect) => characterEffect.rounds > 0);
    // Update the rotation value
    this.rotation--;
    // if the rotation value is less than 0, reset it to the default rotation value and change the sports
    if (this.rotation < 0) {
      this.rotation = TrainingCenterModel.DEFAULT_ROTATION;
      this._sports = this.getSports();
    }
  }

  /**
   * Adds a character to the training center and initializes their training effect.
   *
   * @param {Character} character - The character to be added to the training center.
   *
   * This function performs the following actions:
   * 1. Determines the number of rounds the character will train based on their current level and the training center's level.
   * 2. Calculates the stat improvement the character will gain after completing their training.
   * 3. Gets the available sports for training in the current season.
   * 4. Adds the character, along with their training details (rounds, stats, and sports), to the training center's list of characters in training.
   */
  public getEffect(character: Character): void {
    const rounds: number = this.getRounds(character);
    const stats: number = this.getStats(character);
    const sports: Sport[] = this._sports;
    this._characters.push({ character, sports, rounds, stats });
  }

  /**
   *
   * @param character
   * @private
   */
  private getRounds(character: Character): number {
    switch (this._diceRoundScore) {
      case config.building.trainingCenterModel.diceRound.lowDiceScore.score:
        return config.building.trainingCenterModel.diceRound.lowDiceScore.rounds;
      case config.building.trainingCenterModel.diceRound.mediumDiceScore.score:
        return config.building.trainingCenterModel.diceRound.mediumDiceScore.rounds;
      case config.building.trainingCenterModel.diceRound.highDiceScore.score:
        return config.building.trainingCenterModel.diceRound.highDiceScore.rounds;
      default:
        return 0;
    }
  }

  /**
   *
   * @param character
   * @private
   */
  private getStats(character: Character): number {
    switch (this._diceStatsScore) {
      case config.building.trainingCenterModel.diceStats.lowDiceScore.score:
        return config.building.trainingCenterModel.diceStats.lowDiceScore.bonus;
      case config.building.trainingCenterModel.diceStats.mediumDiceScore.score:
        return config.building.trainingCenterModel.diceStats.mediumDiceScore.bonus;
      case config.building.trainingCenterModel.diceStats.highDiceScore.score:
        return config.building.trainingCenterModel.diceStats.highDiceScore.bonus;
      default:
        return 0;
    }
  }

  get position(): Vector3 {
    return this._position;
  }

  set position(position: Vector3) {
    this._position = position;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get diceRoundPresenter(): DicePresenter {
    return this._diceRoundPresenter;
  }

  get diceStatsPresenter(): DicePresenter {
    return this._diceStatsPresenter;
  }

  set diceStatsScore(diceStatsScore: number) {
    this._diceStatsScore = diceStatsScore;
  }

  set diceRoundScore(diceRoundScore: number) {
    this._diceRoundScore = diceRoundScore;
  }
}
