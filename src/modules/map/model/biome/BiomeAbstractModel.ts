import { MapModel } from '../MapModel.ts';
import { TileModel } from '../TileModel.ts';

export abstract class BiomeAbstractModel {
  protected tiles: TileModel[] = [];
  protected type: TypesBiome;
  protected baseSeed: number | string;

  protected constructor(type: TypesBiome, map: MapModel) {
    this.type = type;
    this.tiles = this.identifyTiles(map.tiles);
    this.baseSeed = map.seed;
  }

  protected identifyTiles(mapTiles: TileModel[][]): TileModel[] {
    const tempsTiles: TileModel[] = [];
    for (const tileRow of mapTiles) {
      for (const tile of tileRow) {
        if (tile.typeBiome === this.type) {
          tempsTiles.push(tile);
        }
      }
    }
    return tempsTiles;
  }

  public static getBiomeByNoiseValue(noiseValue: number): TypesBiome {
    // if (noiseValue <= -0.4)        return TypesBiome.MOUNTAIN_EDGE;
    if (noiseValue < 0.05) return TypesBiome.MOUNTAIN;
    if (noiseValue < 0.55) return TypesBiome.PLAIN;
    if (noiseValue < 0.63) return TypesBiome.LOW_PLAIN;
    if (noiseValue < 0.72) return TypesBiome.DESERT;
    else return TypesBiome.OCEAN;
  }
}

export enum TypesBiome {
  MOUNTAIN,
  PLAIN,
  LOW_PLAIN,
  DESERT,
  OCEAN,
  MOUNTAIN_EDGE,
  NOT_DEFINED,
}
