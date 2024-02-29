import { TileModel } from '../TileModel.ts';
import { GraphTilesModel, TileKey } from '../GraphTilesModel.ts';

export type CoupleTileIndex = { tile: TileModel; index: number };

export class SubBiomeTilesIdentifier {
  private tileStart: TileModel | null = null;
  private tiles: Readonly<TileModel[]> = [];

  private tilesIdentified: TileKey[] = [];
  private iteration = 0;

  private _graph: GraphTilesModel;
  private _validTileFunction: (tile: TileModel) => boolean;
  private static readonly MAX_RECURSIVE_ITERATION = 1000;

  constructor(graph: GraphTilesModel, validTileFunction?: (tile: TileModel) => boolean) {
    this._graph = graph;
    this._validTileFunction = validTileFunction || ((tile: TileModel) => true);
  }

  public identifySubBiomeTiles(tiles: Readonly<TileModel[]>): CoupleTileIndex[] {
    this.tiles = tiles;
    if (this.tiles.length === 0) throw new Error('Tiles array is empty');
    if (this.tiles.length === 1) return [{ tile: tiles[0], index: 0 }];

    this.tileStart = tiles[0];

    this.reset();
    this.iteration++;
    this.tilesIdentified.push(this.tileStart.getID());
    this.recursiveIdentifyTiles(this.tileStart);

    const tilesArrays: CoupleTileIndex[] = [];
    this.tilesIdentified.forEach((id) => {
      const tileIndex = this.tiles.findIndex((tile) => tile.getID() === id);
      if (tileIndex !== -1) tilesArrays.push({ tile: this.tiles[tileIndex], index: tileIndex });
    });

    return tilesArrays;
  }

  private recursiveIdentifyTiles(tile: TileModel) {
    if (this.iteration > SubBiomeTilesIdentifier.MAX_RECURSIVE_ITERATION)
      throw new Error('Max recursive iteration reached');
    const neighbors = this._graph
      .getAdjacentTiles(tile)
      .filter((neighbor) => this.validTileFunction(neighbor) && !this.tilesIdentified.includes(neighbor.getID()));
    this.tilesIdentified.push(...neighbors.map((tile) => tile.getID() as TileKey));
    this.iteration++;
    for (let tile of neighbors) this.recursiveIdentifyTiles(tile);
  }

  private reset() {
    this.tilesIdentified = [];
    this.iteration = 0;
  }

  // Getters and Setters

  get graph(): GraphTilesModel {
    return this._graph;
  }

  set graph(value: GraphTilesModel) {
    this._graph = value;
  }
  get validTileFunction(): (tile: TileModel) => boolean {
    return this._validTileFunction;
  }

  set validTileFunction(value: (tile: TileModel) => boolean) {
    this._validTileFunction = value;
  }
}
