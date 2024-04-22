import { MapModel } from '../MapModel.ts';
import { TileModel } from '../TileModel.ts';
import { config } from '../../../../core/Interfaces.ts';

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
    if (noiseValue < config.map.model.biome.biomeAbstractModel.getBiomeByNoiseValue.moutainNoseValue) return TypesBiome.MOUNTAIN;
    if (noiseValue < config.map.model.biome.biomeAbstractModel.getBiomeByNoiseValue.plainNoseValue) return TypesBiome.PLAIN;
    if (noiseValue < config.map.model.biome.biomeAbstractModel.getBiomeByNoiseValue.lowPlainNoseValue) return TypesBiome.LOW_PLAIN;
    if (noiseValue < config.map.model.biome.biomeAbstractModel.getBiomeByNoiseValue.desertNoseValue) return TypesBiome.DESERT;
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
