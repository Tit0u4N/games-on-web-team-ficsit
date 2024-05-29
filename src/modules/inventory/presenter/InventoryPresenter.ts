import { Inventory } from '../model/Inventory';
import { getRandomUsableObject } from '@object/model/UsableObject.ts';
import { Character } from '@character/model/Character.ts';
import { ObjectRarity } from '@object/model/ObjectRarity.ts';

export class InventoryPresenter {
  getDefaultInventories(characterList: Character[]): Inventory[] {
    const inventory1 = characterList[0].inventory;
    const inventory2 = characterList[1].inventory;
    const inventory3 = characterList[2].inventory;

    for (let i = 0; i < 3; i++) {
      inventory1.addItem(getRandomUsableObject(ObjectRarity.COMMON));
      inventory2.addItem(getRandomUsableObject(ObjectRarity.COMMON));
      inventory3.addItem(getRandomUsableObject(ObjectRarity.COMMON));
    }

    return [inventory1, inventory2, inventory3];
  }
}
