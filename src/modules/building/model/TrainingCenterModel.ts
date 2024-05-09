import { Scene, Vector3 } from '@babylonjs/core';
import { Sport } from '../../../core/singleton/Sport.ts';
import { DicePresenter } from '../../dice/presenter/DicePresenter.ts';
import { Character } from '../../character/model/Character.ts';
import { config } from '../../../core/Interfaces.ts';
import { Statistics } from '../../character/model/Statistics.ts';
import { MapPresenter } from '../../map/presenter/MapPresenter.ts';
import { ITile, TypesTile } from '../../map/model/TileModel.ts';
import { TrainingChoice } from '../view/React/trainingCenter/TrainingChoices.tsx';

interface ICharacterEffect {
  character: Character;
  sports: Sport[];
  rounds: number;
  stats: number;
  injured: boolean;
}

export class TrainingCenterModel {
  private static readonly DEFAULT_ROTATION: number = config.building.trainingCenterModel.defaultRotation;
  private readonly _tileX: number;
  private readonly _tileY: number;
  private readonly mapPresenter: MapPresenter;
  private _sports!: Sport[];
  private rotation: number;
  private _position: Vector3;
  private _name: string;
  private readonly _dicePresenter: DicePresenter;
  private _charactersEffect!: ICharacterEffect[];
  private _userChoice!: TrainingChoice;
  private _tile: ITile | undefined;
  private _charactersInside: Character[] = [];

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
    this._tileX = tileX;
    this._tileY = tileY;
    this.mapPresenter = mapPresenter;
    this._dicePresenter = new DicePresenter(scene);
    this._position = position;
    this.rotation = TrainingCenterModel.DEFAULT_ROTATION;
    this._name = name;
    this._tile = this.mapPresenter.getDisplacementGraph().getTile(this._tileX, this._tileY)!;
  }

  /**
   * Initializes the training center by determining the available sports based on the current season.
   * This function should be called after the training center is created and the view is initialized.
   */
  public initialize(): void {
    this._sports = this.getSports();
    this._charactersEffect = [];
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
    if (!this._tile) {
      this._tile = this.mapPresenter.getDisplacementGraph().getTile(this._tileX, this._tileY);
    }
    const neighbors = this.mapPresenter.getDisplacementGraph().getAdjacentTiles(this._tile!);

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
    this._charactersEffect.forEach((characterEffect: ICharacterEffect) => {
      // remove one round from the character
      characterEffect.rounds--;
      // if the character has no more rounds
      if (characterEffect.rounds === 0) {
        if (characterEffect.injured) characterEffect.character.attributes.injured = true;
        // for each sport stats add the stats to the character
        for (const sport of characterEffect.sports) {
          const statistic = new Map<Sport, number>();
          statistic.set(sport, characterEffect.stats);
          characterEffect.character.statistics.addStat(new Statistics(statistic));
        }
      }
    });
    // remove all characters that have no more rounds and removing them from the training center
    this._charactersEffect = this._charactersEffect.filter((characterEffect) => characterEffect.rounds > 0);
    this._charactersInside = this._charactersInside.filter((character) => this._charactersEffect.map((effect) => effect.character).includes(character));
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
   * // TODO
   */
  public getEffect(character: Character): void {
    const rounds = this._userChoice.rounds;
    const stats = this._userChoice.stats;
    const sports: Sport[] = this._sports;
    const injured = this._userChoice.injuredRisk > Math.random();
    this._charactersEffect.push({ character, sports, rounds, stats, injured });
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

  get dicePresenter(): DicePresenter {
    return this._dicePresenter;
  }

  set userChoice(userChoice: TrainingChoice) {
    this._userChoice = userChoice;
  }

  get tile(): ITile | undefined {
    return this._tile;
  }

  addCharacter(character: Character): void {
    if (this._charactersInside.includes(character)) return;
    this._charactersInside.push(character);
  }

  get charactersInside(): Character[] {
    return this._charactersInside;
  }
}
