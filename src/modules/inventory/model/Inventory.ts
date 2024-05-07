import { UsableObject } from '@object/model/UsableObject.ts';

export class Inventory {
  private _items: UsableObject[] = [];

  public addItem(item: UsableObject): void {
    this._items.push(item);
  }

  public removeItem(item: UsableObject): void {
    const index = this._items.indexOf(item);
    if (index !== -1) {
      this._items.splice(index, 1);
    }
  }

  public get items(): UsableObject[] {
    return this._items;
  }

  public toString(): string {
    // TODO: Return a table with the statistics
    return '';
  }
}
