import { Inventory } from '@inventory/model/Inventory';
import { UsableObject } from '@object/model/UsableObject.ts';

export class InventoryPresenter {
  getDefaultInventories(): Inventory[] {
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
    return [inventory1, inventory2, inventory3];
  }
}
