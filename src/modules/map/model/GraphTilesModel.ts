import { DirectedGraph } from 'data-structure-typed';
import { TileModel } from './TileModel.ts';

export type TileKey = string;

export class GraphTilesModel extends DirectedGraph<TileModel> {
  constructor() {
    super();
  }

  // PUBLIC METHODS
  // Accessors
  getAdjacentTilesID(tile: TileModel): TileKey[] {
    const neighbors = this.getNeighbors(tile.getID());
    return neighbors.map((neighbor) => neighbor.key) as TileKey[];
  }

  getAdjacentTiles(tile: TileModel): TileModel[] {
    const neighbors = this.getNeighbors(tile.getID());
    return neighbors.map((neighbor) => neighbor.value as TileModel);
  }

  tileIsAdjacent(tile1: TileModel, tile2: TileModel): boolean {
    const neighborsTile1 = this.getNeighbors(tile1.getID());
    return neighborsTile1.some((neighbor) =>
      neighbor && neighbor.value ? neighbor.value.getID() === tile2.getID() : false,
    );
  }
}
