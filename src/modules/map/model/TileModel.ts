import { BiomeAbstractModel, TypesBiome } from './biome/BiomeAbstractModel.ts';
import { SubBiomeModel } from './biome/BiomeMountainModel.ts';

export class TileModel {
  private _type: TypesTile | null = null;
  private _x: number;
  private _y: number;
  private noiseValue: number;
  private _typeBiome: TypesBiome = null;
  private _subBiome: SubBiomeModel | null = null;

  constructor(x: number, y: number, noiseValue: number) {
    this._x = x;
    this._y = y;
    this.noiseValue = noiseValue;
    this._typeBiome = BiomeAbstractModel.getBiomeByNoiseValue(noiseValue);
    this._type = this.getTypeByBiome();
  }

  /**
   * @private
   * Get the type of the tile by the type of the biome
   * @returns TypesTile
   */
  private getTypeByBiome(): TypesTile {
    if (this._typeBiome === TypesBiome.MOUNTAIN) return TypesTile.MOUNTAIN;
    else if (this._typeBiome === TypesBiome.PLAIN) return TypesTile.GRASS;
    else if (this._typeBiome === TypesBiome.LOW_PLAIN) return TypesTile.GRASS;
    else if (this._typeBiome === TypesBiome.DESERT) return TypesTile.SAND;
    else if (this._typeBiome === TypesBiome.OCEAN && this.noiseValue < 0.87) return TypesTile.WATER;
    else return TypesTile.DEEP_WATER;
  }

  // PUBLIC METHODS

  /**
   * Add a hill to the tile
   * @returns void
   */
  public addHill(): void {
    if (this._type === TypesTile.GRASS) {
      this._type = TypesTile.HILL_GRASS;
    } else if (this._type === TypesTile.SAND) {
      this._type = TypesTile.HILL_SAND;
    } else if (this._type === TypesTile.FOREST) {
      this._type = TypesTile.HILL_FOREST;
    }
  }

  /**
   * Add a forest to the tile
   * @returns void
   */
  public addForest(): void {
    if (this._type === TypesTile.GRASS) {
      this._type = TypesTile.FOREST;
    } else if (this._type === TypesTile.HILL_GRASS) {
      this._type = TypesTile.HILL_FOREST;
    }
  }

  /**
   * Check if the tile is adjacent to the given tile
   * @param tile
   * @returns boolean
   */
  public isAdjacentToTile(tile: TileModel): boolean {
    return this.isAdjacent(tile.x, tile.y);
  }

  /**
   * Check if the tile is adjacent to the given coordinates
   * @param x
   * @param y
   * @returns boolean
   */
  public isAdjacent(x: number, y: number): boolean {
    if (x % 2 !== 0) {
      return (
        (x === this._x && (y === this._y - 1 || y === this._y + 1)) ||
        ((x === this._x - 1 || x === this._x + 1) && (y === this._y - 1 || y === this._y))
      );
    }
    return (
      (x === this._x && (y === this._y - 1 || y === this._y + 1)) ||
      ((x === this._x - 1 || x === this._x + 1) && (y === this._y + 1 || y === this._y))
    );
  }

  /**
   * Get the ID of the tile for the graph
   * @returns string
   */
  public getID(): string {
    return this._x + '_' + this._y;
  }

  // GETTERS AND SETTERS
  get y(): number {
    return this._y;
  }
  get x(): number {
    return this._x;
  }

  set type(value: TypesTile) {
    this._type = value;
  }

  get type(): TypesTile | null {
    return this._type;
  }
  get typeBiome(): TypesBiome {
    return this._typeBiome;
  }

  set typeBiome(value: TypesBiome) {
    this._typeBiome = value;
  }

  get subBiome(): SubBiomeModel | null {
    return this._subBiome;
  }

  set subBiome(value: SubBiomeModel | null) {
    this._subBiome = value;
  }
}

export enum TypesTile {
  SNOW,
  MOUNTAIN,
  FOREST,
  GRASS,
  SAND,
  WATER,
  DEEP_WATER,
  HILL_GRASS,
  HILL_FOREST,
  HILL_SAND,
  // For debug
  DEFAULT,
  DEFAULT2,
  DEFAULT3,
  DEFAULT4,
  DEFAULT5,
  DEFAULT6,
  DEFAULT7,
  DEFAULT8,
  DEFAULT9,
}
