export class Attributes {
  private readonly _defaultMovement: number;
  private _movement: number;
  private _tiredness: number;
  private _injured: boolean;

  public constructor(movement: number, tiredness: number, injured: boolean) {
    this._movement = movement;
    this._defaultMovement = movement;
    this._tiredness = tiredness;
    this._injured = injured;
  }

  get movement(): number {
    return this._movement;
  }

  set movement(value: number) {
    this._movement = value;
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
    return `Movement: ${this._movement}, Tiredness: ${this._tiredness}, Injured: ${this._injured}`;
  }

  resetMovement(): void {
    this._movement = this._defaultMovement;
  }

  removeMovement(value: number): void {
    this._movement -= value;
  }
}
