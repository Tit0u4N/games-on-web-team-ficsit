import { Sport } from '@sport/model/Sport.ts';

export class Statistics {
  private _items: Sport[] = [];

  public addItem(item: Sport): void {
    this._items.push(item);
  }

  public removeItem(item: Sport): void {
    const index = this._items.indexOf(item);
    if (index !== -1) {
      this._items.splice(index, 1);
    }
  }

  public get items(): Sport[] {
    return this._items;
  }

  public toString(): string {
    // TODO: Return a table with the statistics
    return '';
  }
}
