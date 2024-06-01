import { GameCoreModel } from '@gamecore/model/GameCoreModel.ts';
import { BabylonMainView } from '@gamecore/view/Babylon/BabylonMainView.ts';
import { ApplicationStatus } from './ApplicationStatus.ts';
import { MapPresenter } from '@map/presenter/MapPresenter.ts';
import { CharacterPresenter } from '@character/presenter/CharacterPresenter.ts';
import { InventoryPresenter } from '@inventory/presenter/InventoryPresenter.ts';
import { EventPresenter } from '@event/presenter/EventPresenter.ts';
import { Inventory } from '@inventory/model/Inventory.ts';
import { EventModel } from '@event/model/EventModel.ts';
import { Character } from '@character/model/Character.ts';
import { BuildingPresenter } from '@building/presenter/BuildingPresenter.ts';
import { MapLimits } from '@map/view/Babylon/MapView.ts';
import { Season } from '@core/singleton/Season.ts';
import { TournamentManagerPresenter } from '@tournament/presenter/TournamentManagerPresenter.ts';
import { AtmosphereType, AudioPresenter, MusicType } from '../../audio/presenter/AudioPresenter.ts';
import { OlympicsPresenter } from '@/modules/olympics/presenter/OlympicsPresenter.ts';

export class GameCorePresenter {
  private gameModel: GameCoreModel;
  private status: ApplicationStatus;
  private viewChangeListeners: (() => void)[] = [];
  private _babylonView: BabylonMainView;
  private _buildingPresenter!: BuildingPresenter;
  private _mapPresenter: MapPresenter;
  private inventoryList: Inventory[] = [];
  private events: EventModel[] = [];
  private _characterPresenter!: CharacterPresenter;
  private readonly _tournamentManagerPresenter: TournamentManagerPresenter;
  private _setIsLoading!: (isLoading: boolean) => void;
  public static readonly AUDIO_PRESENTER: AudioPresenter = new AudioPresenter();
  private _olympicsPresenter!: OlympicsPresenter;

  constructor() {
    this.gameModel = new GameCoreModel();
    this.status = ApplicationStatus.MENU;
    this._babylonView = new BabylonMainView(this);
    this._mapPresenter = new MapPresenter(this);
    this.initializeTestData();
    this._tournamentManagerPresenter = new TournamentManagerPresenter(this);
    setTimeout(() => {
      if (this.status === ApplicationStatus.MENU) {
        GameCorePresenter.AUDIO_PRESENTER.playMusic(MusicType.OPENING);
        GameCorePresenter.AUDIO_PRESENTER.music.volume = 0.05;
      }
    }, 1000);
  }

  /* Application management*/

  public getStatus() {
    return this.status;
  }

  public setStatus(status: ApplicationStatus) {
    this.status = status;
  }

  /* Events management */

  /**
   * Subscribe to changes
   * @param listener - listener to subscribe
   */
  public subscribeToViewChanges(listener: () => void) {
    this.viewChangeListeners.push(listener);
  }

  /**
   * Notify view for changes
   */
  notifyViewChange() {
    this.viewChangeListeners.forEach((listener) => listener());
  }

  /* Game logic */

  /**
   * Start a new game
   */
  startGame(characters: Set<Character>) {
    this._characterPresenter = new CharacterPresenter(this, characters);
    const inventoryPresenter = new InventoryPresenter();
    const characterArray = Array.from(this._characterPresenter.characters);
    this.inventoryList = inventoryPresenter.getDefaultInventories(characterArray);
    this.gameModel.createNewGame();
    this.status = ApplicationStatus.GAME;
    this.notifyViewChange();
    GameCorePresenter.AUDIO_PRESENTER.playMusic(MusicType.MAIN);
    GameCorePresenter.AUDIO_PRESENTER.playAtmosphere(AtmosphereType.MAIN);
    GameCorePresenter.AUDIO_PRESENTER.music.volume = 0.35;

    // Wait for the scene to be ready because react load in async
    setTimeout(async () => {
      await this._mapPresenter.initView(this._babylonView.scene);
      await this._characterPresenter.initView(this._babylonView.scene);
      this._mapPresenter.placeCharacters(true);
      this._buildingPresenter = new BuildingPresenter(this, this._mapPresenter, this._tournamentManagerPresenter);
      this._buildingPresenter.initView(this._babylonView.scene);
      this._setIsLoading(false);
      this.notifyViewChange();
      this._buildingPresenter.updateArenasTournament();
    }, 1000);
  }

  private initializeTestData(): void {
    const eventPresenter = new EventPresenter();
    this.events = eventPresenter.getDefaultEvents();
  }

  public getCharacters(): Set<Character> {
    return this._characterPresenter.characters;
  }

  public getCharacterPresenter(): CharacterPresenter {
    return this._characterPresenter;
  }

  public getInventoryList(): Inventory[] {
    return this.inventoryList;
  }

  public getEvents(): EventModel[] {
    return this.events;
  }

  get tournamentManagerPresenter(): TournamentManagerPresenter {
    return this._tournamentManagerPresenter;
  }

  /**
   * Start a new round
   */
  nextRound() {
    const result: boolean = this._buildingPresenter.isAllCharactersReady();
    if (!result) {
      return;
    }
    this._mapPresenter.unselectCharacter();
    this._mapPresenter.updateSelectedCharacter();
    this._buildingPresenter.updateArenasTournament();
    this.gameModel.playRound();

    if (this.gameModel.getRound() === 48) {
      //Ends of the game
      this._olympicsPresenter = new OlympicsPresenter(this);
      this.status = ApplicationStatus.OLYMPICS;
    }

    this.notifyViewChange();
    this._characterPresenter.resetMovements();
    this._buildingPresenter.trainingCenters.forEach((trainingCenter) => {
      trainingCenter.trainingCenter.nextRound();
    });

    // for each player check if they are in a building
    this._characterPresenter.characters.forEach((character) => {
      this.checkCharacterInBuilding(character);
    });
  }

  getCurrentRound() {
    return this.gameModel.getRound();
  }

  get babylonView(): BabylonMainView {
    return this._babylonView;
  }

  get characterPresenter(): CharacterPresenter {
    return this._characterPresenter;
  }

  get mapPresenter(): MapPresenter {
    return this._mapPresenter;
  }

  public getMapLimits(): MapLimits {
    return this._mapPresenter.view.getLimitXYZ();
  }

  set setIsLoading(value: (isLoading: boolean) => void) {
    this._setIsLoading = value;
  }

  checkCharacterInBuilding(character: Character) {
    if (this._buildingPresenter === undefined) {
      return;
    }
    this._buildingPresenter.trainingCenters.forEach((building) => {
      if (building.isCharacterInBuilding(character)) {
        building.onCharacterEnter(character);
      } else {
        building.onCharacterExit(character);
      }
    });
  }

  get buildingPresenter(): BuildingPresenter {
    return this._buildingPresenter;
  }

  get olympicsPresenter(): OlympicsPresenter {
    return this._olympicsPresenter;
  }

  public getCurrentSeason(): Season {
    switch (this.gameModel.getRound() % 12) {
      case 0:
      case 1:
      case 2:
        return Season.getByName('Spring')!;
      case 3:
      case 4:
      case 5:
        return Season.getByName('Summer')!;
      case 6:
      case 7:
      case 8:
        return Season.getByName('Autumn')!;
      case 9:
      case 10:
      case 11:
        return Season.getByName('Winter')!;
      default:
        return Season.getByName('Spring')!;
    }
  }
}
