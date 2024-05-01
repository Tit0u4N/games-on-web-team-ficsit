import { GameCorePresenter } from './GameCorePresenter';
import { Inventory } from '../../inventory/model/Inventory.ts';
import { EventModel } from '../../event/model/EventModel.ts';
import { UsableObject, gameObjects } from '../../object/model/UsableObject.ts';

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
    // Initialize inventory
    const inventory1 = new Inventory();
    const inventory2 = new Inventory();
    const inventory3 = new Inventory();
    for (let i = 0; i < 10; i++) {
      inventory1.addItem(gameObjects[Math.floor(Math.random() * gameObjects.length)]);
      if (i % 2 === 0) {
        inventory1.addItem(gameObjects[Math.floor(Math.random() * gameObjects.length)]);
      }
      inventory2.addItem(gameObjects[Math.floor(Math.random() * gameObjects.length)]);
      if (i % 3 == 0) {
        inventory3.addItem(gameObjects[Math.floor(Math.random() * gameObjects.length)]);
      }
    }
    this.inventoryList = [inventory1, inventory2, inventory3];

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
