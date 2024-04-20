import { GameCorePresenter } from './GameCorePresenter';
import { CharacterFactory } from '../../character/BuilderFactory/CharacterFactory.ts';
import { Inventory } from '../../inventory/model/Inventory.ts';
import { EventModel } from '../../event/model/EventModel.ts';
import { Character } from '../../character/model/Character.ts';
import { UsableObject } from '../../object/model/UsableObject.ts';

export class GameViewPresenter {
  private gameCorePresenter: GameCorePresenter;
  private characters: Character[] | undefined;
  private inventoryList: Inventory[] | undefined;
  private events: EventModel[] | undefined;

  constructor(gameCorePresenter: GameCorePresenter) {
    this.gameCorePresenter = gameCorePresenter;
    // Initialize test data
    this.initializeTestData();
  }

  private initializeTestData(): void {
    // Initialize characters
    const defaultCharacter1 = CharacterFactory.createDefaultCharacter(1, 'John Doe', 'US', 25, '/character_1.png');
    const defaultCharacter2 = CharacterFactory.createDefaultCharacter(1, 'John Doe', 'US', 25, '/character_2.png');
    const defaultCharacter3 = CharacterFactory.createDefaultCharacter(1, 'John Doe', 'US', 25, '/character_3.png');
    this.characters = [defaultCharacter1, defaultCharacter2, defaultCharacter3];

    // Initialize inventory
    const inventory1 = new Inventory();
    const inventory2 = new Inventory();
    const inventory3 = new Inventory();
    for (let i = 0; i < 10; i++) {
      inventory1.addItem(new UsableObject('vite.svg', 'vite.svg'));
      if (i % 2 === 0) {
        inventory1.addItem(new UsableObject('vite.svg', 'vite.svg'));
      }
      inventory2.addItem(new UsableObject('vite.svg', 'vite.svg'));
      if (i % 3 == 0) {
        inventory3.addItem(new UsableObject('vite.svg', 'vite.svg'));
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

  public getCharacters(): Character[] | undefined {
    return this.characters;
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
