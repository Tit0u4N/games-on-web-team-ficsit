import { Inventory } from '../model/Inventory';
import { gameObjects } from '../../object/model/UsableObject';
import { Character } from '../../character/model/Character.ts';

export class InventoryPresenter {
  getDefaultInventories(characterList: Character[]): Inventory[] {
    const inventory1 = characterList[0].inventory;
    const inventory2 = characterList[1].inventory;
    const inventory3 = characterList[2].inventory;

    for (let i = 0; i < 10; i++) {
      // Add a random UsableObject from the gameObjects array to each inventory
      const randomIndex = Math.floor(Math.random() * gameObjects.length);
      const randomUsableObject = gameObjects[randomIndex];

      inventory1.addItem(randomUsableObject);

      if (i % 2 === 0) {
        inventory1.addItem(randomUsableObject);
      }

      inventory2.addItem(gameObjects[Math.floor(randomIndex / 2)]);

      if (i % 3 === 0) {
        inventory3.addItem(randomUsableObject);
      }
    }

    return [inventory1, inventory2, inventory3];
  }
}
