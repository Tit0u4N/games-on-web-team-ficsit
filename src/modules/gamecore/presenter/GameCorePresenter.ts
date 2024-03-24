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
import { Dice } from '../../dice/view/Babylon/Dice.ts';
import { Vector3 } from '@babylonjs/core';

export class GameCorePresenter {
  private gameModel: GameCoreModel;
  private status: ApplicationStatus;
  private viewChangeListeners: (() => void)[] = [];
  private _babylonView: BabylonMainView;
  private mapPresenter: MapPresenter;
  private characters: Character[] = [];
  private inventoryList: Inventory[] = [];
  private events: EventModel[] = [];

  constructor() {
    this.gameModel = new GameCoreModel();
    this.status = ApplicationStatus.MENU;
    this._babylonView = new BabylonMainView();
    this.mapPresenter = new MapPresenter({ size: 60, seed: 'TEST_SEED' });
    this.initializeTestData();
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
      this.mapPresenter.init(this._babylonView.scene);
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
    const dice = new Dice(scene, { position: new Vector3(20, 20, 20) });

    this.notifyViewChange();
  }

  getCurrentRound() {
    return this.gameModel.getRound();
  }

  get babylonView(): BabylonMainView {
    return this._babylonView;
  }
}
