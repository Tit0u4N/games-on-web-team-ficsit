export class Attributes {
  private _movement: number;
  private _reputation: number;
  private _tiredness: number;
  private _injured: boolean;

  public constructor(movement: number, reputation: number, tiredness: number, injured: boolean) {
    this._movement = movement;
    this._reputation = reputation;
    this._tiredness = tiredness;
    this._injured = injured;
  }

  get movement(): number {
    return this._movement;
  }

  set movement(value: number) {
    this._movement = value;
  }

  get reputation(): number {
    return this._reputation;
  }

  set reputation(value: number) {
    this._reputation = value;
  }

  get tiredness(): number {
    return this._tiredness;
  }

  set tiredness(value: number) {
    this._tiredness = value;
  }

  get injured(): boolean {
    return this._injured;
  }

  set injured(value: boolean) {
    this._injured = value;
  }

  public toString(): string {
    return `Movement: ${this._movement}, Reputation: ${this._reputation}, Tiredness: ${this._tiredness}, Injured: ${this._injured}`;
  }
}