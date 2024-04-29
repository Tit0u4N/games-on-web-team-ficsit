import { UsableObject } from '../../object/model/UsableObject.ts';
import { EquippedObject } from './EquippedObject.ts';

export class Inventory {
  private _items: UsableObject[] = [];
  private _equippedObjects: EquippedObject = new EquippedObject();

  public addItem(item: UsableObject): void {
    this._items.push(item);
  }

  public equipItem(item: UsableObject): void {
    if (!this._equippedObjects.canBePlacedInSlot(item.slot, item)) {
      throw new Error(`Cannot equip the item in the slot: ${item.slot}`);
    }
    this._equippedObjects.equip(item, item.slot);
  }

  public unequipItem(item: UsableObject): void {
    this._equippedObjects.unequip(item.slot);
  }

  public removeItem(item: UsableObject): void {
    const index = this._items.indexOf(item);
    if (index !== -1) {
      this._items.splice(index, 1);
    }
  }

  get items(): UsableObject[] {
    return this._items;
  }

  get itemsIds(): number[] {
    return this._items.map((item) => item.id);
  }

  get equippedItems(): UsableObject[] {
    return this._equippedObjects.all;
  }

  get equippedItemsIds(): number[] {
    return this._equippedObjects.all.map((item) => item.id);
  }
}
