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
import { Season } from '../../../core/singleton/Season.ts';
import { TournamentManagerPresenter } from '../../tournament/presenter/TournamentManagerPresenter.ts';

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
  private readonly _tournamentManagerPresenter: TournamentManagerPresenter;

  constructor() {
    this.gameModel = new GameCoreModel();
    this.status = ApplicationStatus.MENU;
    this._babylonView = new BabylonMainView(this);
    this._mapPresenter = new MapPresenter(this, { size: 60, seed: 'TEST_SEED' });
    this.initializeTestData();
    this._characterPresenter = new CharacterPresenter(this);
    this._tournamentManagerPresenter = new TournamentManagerPresenter(this);
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
      this.buildingPresenter = new BuildingPresenter(this, this._mapPresenter, this._tournamentManagerPresenter);
      this.buildingPresenter.initView(this._babylonView.scene);
      this.notifyViewChange();
      this.buildingPresenter.updateArenasTournament();
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

  public getTournamentManagerPresenter(): TournamentManagerPresenter {
    return this._tournamentManagerPresenter;
  }

  /**
   * Start a new round
   */
  nextRound() {
    this.buildingPresenter.updateArenasTournament();
    this.gameModel.playRound();

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

  public getMapLimits(): MapLimits {
    return this._mapPresenter.view.getLimitXYZ();
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
