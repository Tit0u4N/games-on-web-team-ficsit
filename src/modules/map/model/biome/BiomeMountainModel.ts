import { MapModel } from '../MapModel.ts';
import { BiomeAbstractModel, TypesBiome } from './BiomeAbstractModel.ts';
import { SubBiomeModel } from './SubBiomeModel.ts';

export class BiomeMountainModel extends BiomeAbstractModel {
  private subBiomes: SubBiomeModel[] = [];
  private mapModel: MapModel;

  constructor(map: MapModel) {
    super(TypesBiome.MOUNTAIN, map);
    this.mapModel = map;
    this.initializeSubBiomes();
  }

  private initializeSubBiomes(): void {
    const MAX_ITERATIONS = 100;
    let remainingTiles = this.tiles.length;
    for (let i = 0; i < MAX_ITERATIONS && remainingTiles > 0; i++) {
      const underBiome = new SubBiomeModel(TypesBiome.MOUNTAIN, this.tiles, this.mapModel);
      this.subBiomes.push(underBiome);
      remainingTiles -= underBiome.nbTiles();
    }
    if (remainingTiles > 0) {
      throw new Error('Exceeded maximum iterations - possible infinite loop');
    }
  }
}
