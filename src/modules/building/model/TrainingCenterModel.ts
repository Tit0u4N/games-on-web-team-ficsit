import { Scene, Vector3 } from '@babylonjs/core';
import { Sport } from '@core/singleton/Sport.ts';
import { DiceHandler, DicePresenter } from '@dice/presenter/DicePresenter.ts';
import { Character } from '@character/model/Character.ts';
import { config } from '@core/Interfaces.ts';
import { Statistics } from '@character/model/Statistics.ts';
import { MapPresenter } from '@map/presenter/MapPresenter.ts';
import { ITile } from '@map/model/TileModel.ts';
import { TrainingChoice } from '../view/React/trainingCenter/TrainingChoiceCards.tsx';
import { State, TrainingCenterLayoutState } from '../view/React/TrainingCenterLayout.tsx';

interface ICharacterEffect {
  character: Character;
  sports: Sport[];
  rounds: number;
  stats: number;
  injured: boolean;
}

export class TrainingCenterModel implements DiceHandler {
  private static readonly MIN_ROTATION: number = config.building.model.trainingCenterModel.minRotation;
  private static readonly MAX_ROTATION: number = config.building.model.trainingCenterModel.maxRotation;
  private readonly _tileX: number;
  private readonly _tileY: number;
  private readonly mapPresenter: MapPresenter;
  private _sports!: Sport[];
  private _rotation: number;
  private readonly _position: Vector3;
  private _name: string;
  private readonly _dicePresenter: DicePresenter;
  private _charactersEffect!: ICharacterEffect[];
  private _tile: ITile | undefined;
  private _charactersInside: Character[] = [];
  private _differentStates: Map<Character, TrainingCenterLayoutState> = new Map();

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
    this._dicePresenter = new DicePresenter(scene, this);
    this._position = position;
    this._rotation =
      Math.floor(Math.random() * (TrainingCenterModel.MAX_ROTATION - TrainingCenterModel.MIN_ROTATION + 1)) +
      TrainingCenterModel.MIN_ROTATION;
    this._name = name;
    this._tile = this.mapPresenter.getDisplacementGraph().getTile(this._tileX, this._tileY)!;
  }

  handleRollDice(diceValue: number): void {}

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
    const season = this.mapPresenter.gameCorePresenter.getCurrentSeason();
    // Select the number of sport randomly and not repeat them
    const sportsBySeason: Sport[] = [];
    sportsBySeason.push(...Sport.getBySeason(season));
    const sports: Sport[] = [];
    for (let i = 0; i < numberOfSportsSelected; i++) {
      const randomSport = sportsBySeason[Math.floor(Math.random() * sportsBySeason.length)];
      if (!sports.includes(randomSport)) sports.push(randomSport);
    }
    return sports;
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
      this._differentStates.get(characterEffect.character)!.messageContent =
        `Your character will be training for ${characterEffect.rounds} rounds and will gain ${characterEffect.stats} xp.`;
      // if the character has no more rounds
      if (characterEffect.rounds === 0) {
        // for each sport stats add the stats to the character
        for (const sport of characterEffect.sports) {
          const statistic = new Map<Sport, number>();
          statistic.set(sport, characterEffect.stats);
          characterEffect.character.statistics.addStatXp(new Statistics(statistic));
        }
        this._differentStates.delete(characterEffect.character);
      } else {
        characterEffect.character.attributes.movement = 0;
        characterEffect.character.attributes.injured = characterEffect.injured;
      }
    });
    // remove all characters that have no more rounds
    this._charactersEffect = this._charactersEffect.filter((characterEffect) => characterEffect.rounds > 0);
    // Update the rotation value
    this._rotation--;
    // if the rotation value is less than 0, reset it to the default rotation value and change the sports
    if (this._rotation < 0) {
      this._rotation =
        Math.floor(Math.random() * (TrainingCenterModel.MAX_ROTATION - TrainingCenterModel.MIN_ROTATION + 1)) +
        TrainingCenterModel.MIN_ROTATION;
      this._sports = this.getSports();
    }
  }

  /**
   * Adds a character to the training center and initializes their training effect.
   *
   * @param {Character} character - The character to be added to the training center.
   * @param userChoice
   *
   * This function performs the following actions:
   * // TODO
   */
  public getEffect(character: Character, userChoice: TrainingChoice): void {
    const rounds = userChoice.rounds;
    const stats = userChoice.stats;
    const sports: Sport[] = this._sports;
    const injured = userChoice.injuredRisk > Math.random();
    this._charactersEffect.push({ character, sports, rounds, stats, injured });
    character.attributes.movement = 0;
    character.attributes.injured = injured;
  }

  get position(): Vector3 {
    return this._position;
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

  get tile(): ITile | undefined {
    return this._tile;
  }

  /**
   * Adds a character to the training center.
   * The character is added to the list of characters inside the training center.
   * If the character is already inside the training center, it is not added again.
   * If the character is not inside the training center, it is added to the list of characters inside the training center.
   *
   * @param character character to be added to the training center
   */
  addCharacter(character: Character): void {
    if (this._charactersInside.includes(character)) return;
    this._charactersInside.push(character);
    const initialState: TrainingCenterLayoutState = {
      state: State.ROLL_DICE,
      diceResult: null,
      selectedCharacter: character,
      choiceSelected: null,
      messageContent: '',
    };
    this._differentStates.set(character, initialState);
    this._dicePresenter.resetIs3DMod(); // reset the _is3DMod variable to true
  }

  /**
   * Removes a character from the training center.
   * The character is removed from the list of characters inside the training center.
   *
   * @param character character to be removed from the training center
   */
  removeCharacter(character: Character): void {
    this._charactersInside = this._charactersInside.filter((c) => c.id !== character.id);
    this._differentStates.delete(character);
  }

  get charactersInside(): Character[] {
    return this._charactersInside;
  }

  get sports(): Sport[] {
    return this._sports;
  }

  get differentStates(): Map<Character, TrainingCenterLayoutState> {
    return this._differentStates;
  }

  /**
   * Returns the state of a character in the training center.
   *
   * @param character character in the training center
   */
  getState(character: Character): TrainingCenterLayoutState | undefined {
    return this._differentStates.get(character);
  }

  /**
   * Updates the state of a character in the training center.
   * The state is used to determine the current action of the character in the training center.
   * The state is stored in a map with the character as the key.
   * If the character is not found in the map, a new entry is created.
   * If the character is found in the map, the state is updated.
   *
   * @param character character in the training center
   * @param state state of the character
   */
  updateState(character: Character, state: TrainingCenterLayoutState): void {
    this._differentStates.set(character, state);
  }

  get rotation(): number {
    return this._rotation;
  }
}
