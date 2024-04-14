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
import { Reactable } from '../../../core/Interfaces.ts';

export class GameCorePresenter {
  private gameModel: GameCoreModel;
  private status: ApplicationStatus;
  private viewChangeListeners: (() => void)[] = [];
  private _babylonView: BabylonMainView;
  private mapPresenter: MapPresenter;
  private buildingPresenter!: BuildingPresenter;
  private characters: Character[] = [];
  private inventoryList: Inventory[] = [];
  private events: EventModel[] = [];

  private _setViewModalFunc: (modale: Reactable | null) => void = () => {
    console.error('setViewModalFunc not set');
  };

  constructor() {
    this.gameModel = new GameCoreModel();
    this.status = ApplicationStatus.MENU;
    this._babylonView = new BabylonMainView();
    this.mapPresenter = new MapPresenter({ size: 60, seed: 'TEST_SEED' });
    this.buildingPresenter = new BuildingPresenter(this.mapPresenter, this.openModal);
    this.initializeTestData();
  }

  set setViewModalFunc(func: (modale: Reactable | null) => void) {
    this._setViewModalFunc = func;
    console.log('setViewModalFunc', func);
    console.log('_setViewModalFunc', this._setViewModalFunc);
  }

  public openModal(presenter: Reactable): void {
    console.log('openModal', presenter, this._setViewModalFunc);
    this._setViewModalFunc(presenter);
    console.log('openModal2', presenter, this._setViewModalFunc);
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
    setTimeout(() => {
      this.mapPresenter.initView(this._babylonView.scene);
      this.buildingPresenter.initView(this._babylonView.scene);
      this.notifyViewChange();
    }, 100);
  }

  private initializeTestData(): void {
    const characterPresenter = new CharacterPresenter();
    this.characters = characterPresenter.getDefaultCharacters();

    const inventoryPresenter = new InventoryPresenter();
    this.inventoryList = inventoryPresenter.getDefaultInventories();

    const eventPresenter = new EventPresenter();
    this.events = eventPresenter.getDefaultEvents();
  }

  public getCharacters(): Character[] {
    return this.characters;
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
    this.openModal(dicePresenter);

    this.notifyViewChange();
  }

  getCurrentRound() {
    return this.gameModel.getRound();
  }

  get babylonView(): BabylonMainView {
    return this._babylonView;
  }
}
