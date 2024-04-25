import { MapModel } from '../MapModel.ts';
import { BiomeAbstractModel, TypesBiome } from './BiomeAbstractModel.ts';
import { SubBiomeModel } from './SubBiomeModel.ts';
import { CoupleTileIndex, SubBiomeTilesIdentifier } from '../utils/SubBiomeTilesIdentifier.ts';
import { config } from '../../../../core/Interfaces.ts';

export class BiomeMountainModel extends BiomeAbstractModel {
  private subBiomes: SubBiomeModel[] = [];
  private readonly mapModel: MapModel;

  constructor(map: MapModel) {
    super(TypesBiome.MOUNTAIN, map);
    this.mapModel = map;
    this.initializeSubBiomes();
  }

  private initializeSubBiomes(): void {
    const MAX_ITERATIONS = config.map.model.biome.biomeMountainModel.initializeSubBiomes.maxRecursiveIterations;
    let remainingTiles = this.tiles.length;
    let cpt = 0;

    const tilesIdentifier = new SubBiomeTilesIdentifier(this.mapModel.graph, (tile) => tile.typeBiome === this.type);

    while (remainingTiles > 0 && cpt < MAX_ITERATIONS) {
      const couples: CoupleTileIndex[] = tilesIdentifier.identifySubBiomeTiles(this.tiles);
      this.subBiomes.push(
        new SubBiomeModel(
          this.type,
          couples.map((c) => c.tile),
          this.mapModel,
        ),
      );
      const indexToRemove = couples.map((c) => c.index).sort((a, b) => b - a);
      indexToRemove.forEach((index) => this.tiles.splice(index, 1));
      remainingTiles = this.tiles.length;
      cpt++;
    }

    if (remainingTiles > 0) {
      throw new Error('Exceeded maximum iterations - possible infinite loop');
    }
  }
}
