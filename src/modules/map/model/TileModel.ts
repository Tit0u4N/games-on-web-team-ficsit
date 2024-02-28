import { BiomeAbstractModel, TypesBiome } from './biome/BiomeAbstractModel.ts';
import { TileKey } from './GraphTilesModel.ts';
import { SubBiomeModel } from './biome/SubBiomeModel.ts';

export interface ITile {
  getID(): TileKey;
  get x(): number;
  get y(): number;
  get type(): TypesTile;
  get subBiome(): SubBiomeModel;
}

export class TileModel implements ITile {
  private _type: TypesTile;
  private _x: number;
  private _y: number;
  private noiseValue: number;
  private _typeBiome: TypesBiome;
  private _subBiome!: SubBiomeModel;

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
    switch (this._typeBiome) {
        case TypesBiome.MOUNTAIN:
            return TypesTile.MOUNTAIN;
        case TypesBiome.PLAIN:
        case TypesBiome.LOW_PLAIN:
            return TypesTile.GRASS;
        case TypesBiome.DESERT:
            return TypesTile.SAND;
        case TypesBiome.OCEAN:
            return this.noiseValue < 0.87 ? TypesTile.WATER : TypesTile.DEEP_WATER;
    }
    // For debug
    return TypesTile.DEFAULT;
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
   * Get the ID of the tile for the graph
   * @returns string
   */
  public getID(): TileKey {
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

  get type(): TypesTile {
    return this._type;
  }
  get typeBiome(): TypesBiome {
    return this._typeBiome;
  }

  set typeBiome(value: TypesBiome) {
    this._typeBiome = value;
  }

  get subBiome(): SubBiomeModel {
    return this._subBiome;
  }

  set subBiome(value: SubBiomeModel) {
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
