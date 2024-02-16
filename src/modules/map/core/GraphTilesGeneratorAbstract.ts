import { MapModel } from '../model/MapModel.ts';
import { TileModel } from '../model/TileModel.ts';

export abstract class GraphTilesGeneratorAbstract {
  protected readonly mapModel: MapModel;
  protected readonly tileConditionFunc: (tile: TileModel) => boolean = (tile: TileModel) => true;
  protected readonly segmentTiles: TileModel[];

  constructor(mapModel: MapModel, tileConditionFunc?: (tile: TileModel) => boolean, segmentTiles?: TileModel[]) {
    this.mapModel = mapModel;
    this.segmentTiles = segmentTiles || mapModel.tiles.flat();
    this.tileConditionFunc = tileConditionFunc || this.tileConditionFunc;
  }

  /**
   * Generate the graph of the valid tiles by the condition function
   * @returns DirectedGraph<TileModel>
   */

  /**
   * @private
   * Return all tiles that are validate for the graph by the condition function
   * @returns TileModel[]
   */
  protected getTilesValidateForGraph(): TileModel[] {
    const tilesGood: TileModel[] = [];
    for (const tile of this.segmentTiles) {
      if (this.tileConditionFunc(tile)) {
        tilesGood.push(tile);
      }
    }
    return tilesGood;
  }

  /**
   * @private
   * Return all tiles that are adjacent to the tile
   * @param tile : TileModel - The tile to get the adjacent tiles
   * @returns TileModel[]
   */
  protected getAdjacentTiles(tile: TileModel): TileModel[] {
    const adjacentTiles: TileModel[] = [];

    const maxX = this.mapModel.tiles.length;
    const maxY = this.mapModel.tiles[0].length;

    if (tile.x % 2 === 0) {
      if (tile.x - 1 >= 0) {
        adjacentTiles.push(this.mapModel.getTile(tile.x - 1, tile.y)); //ok 17_44
        if (tile.y - 1 >= 0) {
          adjacentTiles.push(this.mapModel.getTile(tile.x - 1, tile.y - 1)); //ok 17_43
        }
      }
      if (tile.y - 1 >= 0) adjacentTiles.push(this.mapModel.getTile(tile.x, tile.y - 1)); //ok 18_43
      if (tile.x + 1 < maxX) {
        adjacentTiles.push(this.mapModel.getTile(tile.x + 1, tile.y)); //ok 19_44
        if (tile.y - 1 >= 0) {
          adjacentTiles.push(this.mapModel.getTile(tile.x + 1, tile.y - 1)); //ok 19_43
        }
      }
      if (tile.y + 1 < maxY) {
        adjacentTiles.push(this.mapModel.getTile(tile.x, tile.y + 1)); //ok 18_45
      }
    } else {
      if (tile.x - 1 >= 0) {
        adjacentTiles.push(this.mapModel.getTile(tile.x - 1, tile.y)); //ok 18_44
        if (tile.y + 1 < maxY) {
          adjacentTiles.push(this.mapModel.getTile(tile.x - 1, tile.y + 1)); //ok 18_45
        }
      }
      if (tile.y + 1 < maxY) adjacentTiles.push(this.mapModel.getTile(tile.x, tile.y + 1)); //ok 19_45
      if (tile.x + 1 < maxX) {
        adjacentTiles.push(this.mapModel.getTile(tile.x + 1, tile.y)); //ok 20_44
        if (tile.y + 1 < maxY) {
          adjacentTiles.push(this.mapModel.getTile(tile.x + 1, tile.y + 1)); //ok 20_45
        }
      }
      if (tile.y - 1 >= 0) adjacentTiles.push(this.mapModel.getTile(tile.x, tile.y - 1)); //ok 19_43
    }

    return adjacentTiles.filter((tile) => this.tileConditionFunc(tile));
  }
}
