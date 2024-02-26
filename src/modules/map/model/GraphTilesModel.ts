import { DirectedGraph } from 'data-structure-typed';
import { ITile, TileModel } from './TileModel.ts';

export type TileKey = string;

export interface IGraphTiles {
  getAdjacentTilesID(tile: TileModel): TileKey[];
  getAdjacentTiles(tile: ITile): ITile[];
  tileIsAdjacent(tile1: ITile, tile2: ITile): boolean;
}

export class GraphTilesModel extends DirectedGraph<TileModel> implements IGraphTiles {
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
}
