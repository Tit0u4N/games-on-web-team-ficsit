import { GameCorePresenter } from './GameCorePresenter';
import { Inventory } from '../../inventory/model/Inventory.ts';
import { EventModel } from '../../event/model/EventModel.ts';

export class GameViewPresenter {
  private gameCorePresenter: GameCorePresenter;
  private inventoryList: Inventory[] | undefined;
  private events: EventModel[] | undefined;

  constructor(gameCorePresenter: GameCorePresenter) {
    this.gameCorePresenter = gameCorePresenter;
    // Initialize test data
    this.initializeTestData();
  }

  private initializeTestData(): void {
    // Initialize events
    const event1 = new EventModel(1, 'This is the first event');
    const event2 = new EventModel(2, 'This is the second event');
    const event3 = new EventModel(3, 'This is the third event');
    const event4 = new EventModel(3, 'This is the third event');
    const event5 = new EventModel(3, 'This is the third event');
    const event6 = new EventModel(3, 'This is the 5 event');
    const event7 = new EventModel(3, 'This is the 7 event');
    const event8 = new EventModel(3, 'This is the 8 event');
    this.events = [event1, event2, event3, event4, event5, event6, event7, event8];
  }

  public getInventoryList(): Inventory[] | undefined {
    return this.inventoryList;
  }

  public getEvents(): EventModel[] | undefined {
    return this.events;
  }

  public nextRound(): void {
    this.gameCorePresenter.nextRound();
  }

  public getCurrentRound(): number {
    return this.gameCorePresenter.getCurrentRound();
  }
}
