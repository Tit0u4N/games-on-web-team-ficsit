import { UsableObject } from '../../object/model/UsableObject.ts';
import { EquippedObjects } from './EquippedObjects.ts';
import { config } from '../../../core/Interfaces.ts';

export class Inventory {
  private _items: Array<UsableObject | null> = [];
  private _equippedObjects: EquippedObjects = new EquippedObjects();

  constructor() {
    this._items = Inventory.generateEmptyArray();
  }

  static generateEmptyArray(): Array<null> {
    return Array.from({ length: config.character.inventory.maxItems }, () => null);
  }

  public addItem(item: UsableObject | null, position?: number): void {
    if (!position) position = this.findEmptyPosition();
    this._items[position] = item;
  }

  public removeItem(item: UsableObject | null): void {
    if (!item) return;
    const index = this._items.indexOf(item);
    console.log('removeItem index : ', index);
    if (index !== -1) {
      this._items[index] = null;
    }
  }

  public findEmptyPosition(): number {
    return this._items.indexOf(null);
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

  getItemsFromPosition(position: number): UsableObject | null {
    return this._items[position];
  }

  get items(): UsableObject[] {
    return this._items.filter((item) => item !== null) as UsableObject[];
  }

  get itemsIds(): number[] {
    return this.items.map((item) => item.id);
  }

  get equippedItems(): EquippedObjects {
    return this._equippedObjects;
  }

  get equippedItemsIds(): number[] {
    return this._equippedObjects.all.map((item) => item.id);
  }
}
