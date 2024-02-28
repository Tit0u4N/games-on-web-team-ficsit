import { TypesBiome } from './BiomeAbstractModel.ts';
import { MapModel } from '../MapModel.ts';
import { BiomeMountainModel } from './BiomeMountainModel.ts';
import { BiomePlainModel } from './BiomePlainModel.ts';

export const createBiome = (type: TypesBiome, map: MapModel) => {
  switch (type) {
    case TypesBiome.MOUNTAIN:
      return new BiomeMountainModel(map);
    case TypesBiome.PLAIN:
      return new BiomePlainModel(map);
    default:
      throw new Error('Biome not found');
  }
};
