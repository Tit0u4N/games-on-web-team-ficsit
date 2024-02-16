import { NoiseMap } from './NoiseMap.ts';
import { BiomeAbstractModel, TypesBiome } from './biome/BiomeAbstractModel.ts';
import { createBiome } from './biome/BiomeFacoryModel.ts';

import { TileModel } from './TileModel.ts';
import {DirectedGraph, VertexKey} from 'data-structure-typed';
import { GraphTilesModelGenerator } from './utils/GraphTilesModelGenerator.ts';

export class MapModel {
  private _tiles: TileModel[][] = [];
  private readonly _size: number;
  private readonly _seed: number | string;
  private _biomes: BiomeAbstractModel[] = [];
  private _graph: DirectedGraph<TileModel>;

  constructor(size: number, seed?: number | string) {
    this._size = size;
    this._seed = seed || Math.random();

    this.generate();
  }

  /**
   * Generate the base map in the tiles array
   * Generate the biomes
   * Generate the graph of the tiles
   * @private
   */
  private generate(): void {
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
        this._tiles[x].push(new TileModel(this, x, y, noise.get(x, y)));
      }
    }
  }

  private identifyBiomes(): BiomeAbstractModel[] {
    const tempBiomes: BiomeAbstractModel[] = [];
    tempBiomes.push(createBiome(TypesBiome.MOUNTAIN, this));
    tempBiomes.push(createBiome(TypesBiome.PLAIN, this));
    return tempBiomes;
  }

  // Tiles methods

  public tileIsAdjacent(tile1: TileModel, tile2: TileModel): boolean {
    if (!this._graph) throw new Error('Graph is not defined');
    const neighborsTile1 = this._graph.getNeighbors(tile1.getID());
    return neighborsTile1.some(neighbor => neighbor && neighbor.value ? neighbor.value.getID() === tile2.getID() : false);
  }

  public getAdjacentTiles(tile: TileModel): TileModel[] {
      if (!this._graph) throw new Error('Graph is not defined');
      const neighbors = this._graph.getNeighbors(tile.getID());
      const tiles : TileModel[] = [];
        neighbors.forEach(neighbor => {
            if(neighbor.value) {
              tiles.push(neighbor.value);
            }
        });
      return tiles;
  }

  public getAdjacentTilesID(tile: TileModel): VertexKey[] {
    if (!this._graph) throw new Error('Graph is not defined');
    const neighbors = this._graph.getNeighbors(tile.getID());
    return neighbors.map(neighbor => neighbor.key);
  }

  // Getters

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
