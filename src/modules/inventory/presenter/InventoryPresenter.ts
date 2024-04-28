import { Inventory } from '../model/Inventory';
import { gameObjects } from '../../object/model/UsableObject';

export class InventoryPresenter {
  getDefaultInventories(): Inventory[] {
    const inventory1 = new Inventory();
    const inventory2 = new Inventory();
    const inventory3 = new Inventory();

    for (let i = 0; i < 10; i++) {
      // Add a random UsableObject from the gameObjects array to each inventory
      const randomIndex = Math.floor(Math.random() * gameObjects.length);
      const randomUsableObject = gameObjects[randomIndex];

      inventory1.addItem(randomUsableObject);

      if (i % 2 === 0) {
        inventory1.addItem(randomUsableObject);
      }

      inventory2.addItem(randomUsableObject);

      if (i % 3 === 0) {
        inventory3.addItem(randomUsableObject);
      }
    }

    return [inventory1, inventory2, inventory3];
  }
}
