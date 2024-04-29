import { config } from '../../../core/Interfaces.ts';
import { UsableObject } from '../../object/model/UsableObject.ts';

export class Inventory {
  private _items: UsableObject[] = [];
  private _equippedItems: UsableObject[] = [];
  private _maxItemsEquipped: number = config.inventory.maxItemsEquipped;

  public addItem(item: UsableObject): void {
    this._items.push(item);
  }

  public equipItem(item: UsableObject): void {
    if (this._equippedItems.length < this._maxItemsEquipped) {
      this._equippedItems.push(item);
    } else {
      // TODO: Send a message to the user
    }
  }

  public unequipItem(item: UsableObject): void {
    const index = this._equippedItems.indexOf(item);
    if (index !== -1) {
      this._equippedItems.splice(index, 1);
    }
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
    return this._equippedItems;
  }

  get equippedItemsIds(): number[] {
    return this._equippedItems.map((item) => item.id);
  }
}
