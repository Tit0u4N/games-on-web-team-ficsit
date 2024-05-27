export class ObjectRarity {
  private readonly _name: string;
  private readonly _color: 'default' | 'success' | 'secondary';
  private readonly _bonus: number;

  constructor(name: string, color: 'default' | 'success' | 'secondary', bonus: number) {
    this._name = name;
    this._color = color;
    this._bonus = bonus;
  }

  get name(): string {
    return this._name;
  }

  get color(): 'default' | 'success' | 'secondary' {
    return this._color;
  }

  get bonus(): number {
    return this._bonus;
  }

  static COMMON = new ObjectRarity('Common', 'default', 1);
  static UNCOMMON = new ObjectRarity('Rare', 'success', 2);
  static RARE = new ObjectRarity('Epic', 'secondary', 3);

  static ALL = [ObjectRarity.COMMON, ObjectRarity.UNCOMMON, ObjectRarity.RARE];
}
