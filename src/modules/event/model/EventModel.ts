export class EventModel {
  private _id: number;
  private _name: string;

  public constructor(id: number, name: string) {
    this._id = id;
    this._name = name;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  public toString(): string {
    return `Event: ${this._name}`;
  }
}
