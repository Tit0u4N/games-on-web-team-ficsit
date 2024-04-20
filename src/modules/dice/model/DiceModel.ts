export class DiceModel {
  diceValues: number[];
  _finalValue!: number;

  constructor(diceValues: number[] = DiceModel.initDiceValues()) {
    this.diceValues = diceValues;
  }

  getRandDiceValue(): number {
    this._finalValue = this.diceValues[Math.floor(Math.random() * this.diceValues.length)];
    return this._finalValue;
  }

  get finalValue(): number {
    return this._finalValue;
  }

  set finalValue(value: number) {
    this._finalValue = value;
  }

  public static initDiceValues(nbFaces: number = 20): number[] {
    const diceValues: number[] = [];
    for (let i = 1; i <= nbFaces; i++) {
      diceValues.push(i);
    }
    return diceValues;
  }
}
