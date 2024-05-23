import { GameCoreModel } from '../model/GameCoreModel.ts';
import { BabylonMainView } from '../view/Babylon/BabylonMainView.ts';
import { ApplicationStatus } from './ApplicationStatus.ts';
import { MapPresenter } from '../../map/presenter/MapPresenter.ts';
import { CharacterPresenter } from '../../character/presenter/CharacterPresenter.ts';
import { InventoryPresenter } from '../../inventory/presenter/InventoryPresenter.ts';
import { EventPresenter } from '../../event/presenter/EventPresenter.ts';
import { Inventory } from '../../inventory/model/Inventory.ts';
import { EventModel } from '../../event/model/EventModel.ts';
import { Character } from '../../character/model/Character.ts';
import { BuildingPresenter } from '../../building/presenter/BuildingPresenter.ts';
import { DicePresenter } from '../../dice/presenter/DicePresenter.ts';
import { ModalManager } from '../../../core/singleton/ModalManager.ts';
import { MapLimits } from '../../map/view/Babylon/MapView.ts';
import { AtmosphereType, AudioPresenter, MusicType } from '../../audio/presenter/AudioPresenter.ts';

export class GameCorePresenter {
  private gameModel: GameCoreModel;
  private status: ApplicationStatus;
  private viewChangeListeners: (() => void)[] = [];
  private _babylonView: BabylonMainView;
  private buildingPresenter!: BuildingPresenter;
  private _mapPresenter: MapPresenter;
  private inventoryList: Inventory[] = [];
  private events: EventModel[] = [];
  private readonly _characterPresenter: CharacterPresenter;
  private readonly _audioPresenter: AudioPresenter;

  constructor() {
    this.gameModel = new GameCoreModel();
    this.status = ApplicationStatus.MENU;
    this._babylonView = new BabylonMainView(this);
    this._mapPresenter = new MapPresenter(this, { size: 60, seed: 'TEST_SEED' });
    this.initializeTestData();
    this._characterPresenter = new CharacterPresenter(this);
    this._audioPresenter = new AudioPresenter();
    setTimeout(() => {
      this._audioPresenter.playMusic(MusicType.OPENING);
    }, 1000);
  }
  /* Application management*/

  public getStatus() {
    return this.status;
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
  startGame() {
    this.gameModel.createNewGame();
    this.status = ApplicationStatus.GAME;
    this.notifyViewChange();
    this._audioPresenter.playMusic(MusicType.MAIN);
    this._audioPresenter.playAtmosphere(AtmosphereType.MAIN);

    // Wait for the scene to be ready because react load in async
    setTimeout(async () => {
      this._mapPresenter.initView(this._babylonView.scene);
      await this._characterPresenter.initView(this._babylonView.scene);
      this._mapPresenter.placeCharacters(true);
      this.buildingPresenter = new BuildingPresenter(this._mapPresenter);
      this.buildingPresenter.initView(this._babylonView.scene);
      this.notifyViewChange();
    }, 1000);
  }

  private initializeTestData(): void {
    const inventoryPresenter = new InventoryPresenter();
    this.inventoryList = inventoryPresenter.getDefaultInventories();

    const eventPresenter = new EventPresenter();
    this.events = eventPresenter.getDefaultEvents();
  }

  public getCharacters(): Set<Character> {
    return this._characterPresenter.characters;
  }

  public getInventoryList(): Inventory[] {
    return this.inventoryList;
  }

  public getEvents(): EventModel[] {
    return this.events;
  }

  /**
   * Start a new round
   */
  nextRound() {
    this.gameModel.playRound();

    const scene = this._babylonView.scene;
    const dicePresenter = new DicePresenter(scene);
    ModalManager.getInstance().openModal(dicePresenter);

    this.notifyViewChange();
    this._characterPresenter.resetMovements();
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

  get audioPresenter(): AudioPresenter {
    return this._audioPresenter;
  }

  public getMapLimits(): MapLimits {
    return this._mapPresenter.view.getLimitXYZ();
  }
}
