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
import { MapLimits } from '../../map/view/Babylon/MapView.ts';

export class GameCorePresenter {
  private gameModel: GameCoreModel;
  private status: ApplicationStatus;
  private viewChangeListeners: (() => void)[] = [];
  private _babylonView: BabylonMainView;
  private _buildingPresenter!: BuildingPresenter;
  private _mapPresenter: MapPresenter;
  private inventoryList: Inventory[] = [];
  private events: EventModel[] = [];
  private readonly _characterPresenter: CharacterPresenter;

  constructor() {
    this.gameModel = new GameCoreModel();
    this.status = ApplicationStatus.MENU;
    this._babylonView = new BabylonMainView(this);
    this._mapPresenter = new MapPresenter(this, { size: 60, seed: 'TEST_SEED' });
    this.initializeTestData();
    this._characterPresenter = new CharacterPresenter(this);
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

    // Wait for the scene to be ready because react load in async
    setTimeout(async () => {
      this._mapPresenter.initView(this._babylonView.scene);
      await this._characterPresenter.initView(this._babylonView.scene);
      this._mapPresenter.placeCharacters(true);
      this._buildingPresenter = new BuildingPresenter(this._mapPresenter);
      this._buildingPresenter.initView(this._babylonView.scene);
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
    const result: boolean = this._buildingPresenter.isAllCharactersReady();
    console.log('Result', result);
    if (!result) {
      console.error('Not all characters are ready to start a new round');
      return;
    }
    this.gameModel.playRound();

    this.notifyViewChange();
    this._characterPresenter.resetMovements();
    this._buildingPresenter.trainingCenters.forEach((trainingCenter) => {
      trainingCenter.trainingCenter.nextRound();
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
}
