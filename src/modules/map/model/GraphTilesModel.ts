import { DirectedGraph } from 'data-structure-typed';
import { ITile, TileModel } from './TileModel.ts';

export type TileKey = string;

export interface IGraphTiles {
  getAdjacentTilesID(tile: TileModel): TileKey[];

  getAdjacentTiles(tile: ITile): ITile[];

  tileIsAdjacent(tile1: ITile, tile2: ITile): boolean;

  getTile(x: number, y: number): ITile | undefined;

  getDistance(obj1: { x: number; y: number }, obj2: { x: number; y: number }): number;

  getSize(): number;
}

export class GraphTilesModel extends DirectedGraph<TileModel> implements IGraphTiles {
  private graphSize!: number;

  constructor() {
    super();
  }

  // PUBLIC METHODS
  // Accessors
  getAdjacentTilesID(tile: ITile): TileKey[] {
    const neighbors = this.getNeighbors(tile.getID());
    return neighbors.map((neighbor) => neighbor.key) as TileKey[];
  }

  getAdjacentTiles(tile: ITile): TileModel[] {
    const neighbors = this.getNeighbors(tile.getID());
    return neighbors.map((neighbor) => neighbor.value as TileModel);
  }

  tileIsAdjacent(tile1: ITile, tile2: ITile): boolean {
    const neighborsTile1 = this.getNeighbors(tile1.getID());
    return neighborsTile1.some((neighbor) =>
      neighbor && neighbor.value ? neighbor.value.getID() === tile2.getID() : false,
    );
  }

  getTile(x: number, y: number): ITile | undefined {
    return this.get(GraphTilesModel.getIDTile(x, y));
  }

  getDistance(obj1: { x: number; y: number }, obj2: { x: number; y: number }): number {
    const dikjstra = this.dijkstra(
      GraphTilesModel.getIDTile(obj1.x, obj1.y),
      GraphTilesModel.getIDTile(obj2.x, obj2.y),
    );
    if (!dikjstra?.minDist) return -1;
    return dikjstra.minDist;
  }

  getSize(): number {
    return this.graphSize;
  }

  // STATIC METHODS
  static getIDTile(x: number, y: number): TileKey {
    return x + '_' + y;
  }

  setGraphSize(_size: number) {
    this.graphSize = _size;
  }
}
