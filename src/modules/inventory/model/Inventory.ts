import { UsableObject } from '../../object/model/UsableObject.ts';
import { EquippedObjects } from './EquippedObjects.ts';
import { config } from '../../../core/Interfaces.ts';

export class Inventory {
  private _items: UsableObject[] = [];
  private _equippedObjects: EquippedObjects = new EquippedObjects();

  canBeAdded(item: UsableObject): boolean {
    return this._items.length < config.character.inventory.maxItems;
  }

  public addItem(item: UsableObject): void {
    this._items.push(item);
  }

  public canBeRemoved(item: UsableObject): boolean {
    return this._items.includes(item);
  }

  public removeItem(item: UsableObject): void {
    const index = this._items.indexOf(item);
    if (index !== -1) {
      this._items.splice(index, 1);
    }
  }

  public equipItem(item: UsableObject): void {
    if (!this._equippedObjects.canBePlacedInSlot(item.slot, item)) {
      throw new Error(`Cannot equip the item in the slot: ${item.slot}`);
    }
    this._equippedObjects.equip(item, item.slot);
  }

  public unEquipItem(item: UsableObject): void {
    this._equippedObjects.unequip(item.slot);
  }

  get items(): UsableObject[] {
    return this._items;
  }

  get itemsIds(): number[] {
    return this._items.map((item) => item.id);
  }

  get equippedItems(): EquippedObjects {
    return this._equippedObjects;
  }

  get equippedItemsIds(): number[] {
    return this._equippedObjects.all.map((item) => item.id);
  }
}
