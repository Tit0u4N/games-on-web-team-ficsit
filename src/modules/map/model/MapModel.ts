import { NoiseMap } from './NoiseMap.ts';
import { BiomeAbstractModel, TypesBiome } from './biome/BiomeAbstractModel.ts';
import { TileModel } from './TileModel.ts';
import { GraphTilesModelGenerator } from './utils/GraphTilesModelGenerator.ts';
import { GraphTilesModel } from './GraphTilesModel.ts';
import { createBiome } from './biome/BiomeFactoryModel.ts';

export class MapModel {
  private _tiles: TileModel[][] = [];
  private readonly _size: number;
  private readonly _seed: number | string;
  private _biomes: BiomeAbstractModel[] = [];
  private _graph: GraphTilesModel;

  constructor(size: number, seed?: number | string) {
    this._size = size;
    this._seed = seed || Math.random();

    this.generateBaseMap();
    const graphGenerator = new GraphTilesModelGenerator(this);
    this._graph = graphGenerator.generateGraphTiles();
    this._biomes = this.identifyBiomes();
  }

  /**
   * Generate the base map in the tiles array
   * @private
   */
  private generateBaseMap(): void {
    const noise = new NoiseMap(this._size, this._size, this._seed);
    for (let x = 0; x < this._size; x++) {
      this._tiles.push([]);
      for (let y = 0; y < this._size; y++) {
        this._tiles[x].push(new TileModel(x, y, noise.get(x, y)));
      }
    }
  }

  private identifyBiomes(): BiomeAbstractModel[] {
    const tempBiomes: BiomeAbstractModel[] = [];
    tempBiomes.push(createBiome(TypesBiome.MOUNTAIN, this));
    tempBiomes.push(createBiome(TypesBiome.PLAIN, this));
    return tempBiomes;
  }

  // Getters

  get graph(): GraphTilesModel {
    return this._graph;
  }
  get seed(): number | string {
    return this._seed;
  }

  get tiles(): TileModel[][] {
    return this._tiles;
  }

  get size(): number {
    return this._size;
  }

  public getTile(x: number, y: number): TileModel {
    if (x >= 0 && x < this._size && y >= 0 && y < this._size) {
      return this._tiles[x][y];
    }
    throw new Error('Tile not found x : ' + x + ' or  y : ' + y + ' is out of range');
  }
}
