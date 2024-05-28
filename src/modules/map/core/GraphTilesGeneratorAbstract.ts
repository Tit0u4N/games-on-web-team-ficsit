import { MapModel } from '@map/model/MapModel.ts';
import { TileModel } from '@map/model/TileModel.ts';

export abstract class GraphTilesGeneratorAbstract {
  private _mapModel: MapModel;
  private _tileConditionFunc: (tile: TileModel) => boolean = (tile: TileModel) => true;
  private _segmentTiles: TileModel[];

  protected constructor(
    mapModel: MapModel,
    tileConditionFunc?: (tile: TileModel) => boolean,
    segmentTiles?: TileModel[],
  ) {
    this._mapModel = mapModel;
    this._segmentTiles = segmentTiles || mapModel.tiles.flat();
    this._tileConditionFunc = tileConditionFunc || this._tileConditionFunc;
  }

  /**
   * @private
   * Return all tiles that are validate for the graph by the condition function
   * @returns TileModel[]
   */
  protected getTilesValidateForGraph(): TileModel[] {
    const tilesGood: TileModel[] = [];
    for (const tile of this._segmentTiles) {
      if (this._tileConditionFunc(tile)) {
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

    const maxX = this._mapModel.tiles.length;
    const maxY = this._mapModel.tiles[0].length;

    if (tile.x % 2 === 0) {
      if (tile.x - 1 >= 0) {
        adjacentTiles.push(this._mapModel.getTile(tile.x - 1, tile.y)); //ok 17_44
        if (tile.y - 1 >= 0) {
          adjacentTiles.push(this._mapModel.getTile(tile.x - 1, tile.y - 1)); //ok 17_43
        }
      }
      if (tile.y - 1 >= 0) adjacentTiles.push(this._mapModel.getTile(tile.x, tile.y - 1)); //ok 18_43
      if (tile.x + 1 < maxX) {
        adjacentTiles.push(this._mapModel.getTile(tile.x + 1, tile.y)); //ok 19_44
        if (tile.y - 1 >= 0) {
          adjacentTiles.push(this._mapModel.getTile(tile.x + 1, tile.y - 1)); //ok 19_43
        }
      }
      if (tile.y + 1 < maxY) {
        adjacentTiles.push(this._mapModel.getTile(tile.x, tile.y + 1)); //ok 18_45
      }
    } else {
      if (tile.x - 1 >= 0) {
        adjacentTiles.push(this._mapModel.getTile(tile.x - 1, tile.y)); //ok 18_44
        if (tile.y + 1 < maxY) {
          adjacentTiles.push(this._mapModel.getTile(tile.x - 1, tile.y + 1)); //ok 18_45
        }
      }
      if (tile.y + 1 < maxY) adjacentTiles.push(this._mapModel.getTile(tile.x, tile.y + 1)); //ok 19_45
      if (tile.x + 1 < maxX) {
        adjacentTiles.push(this._mapModel.getTile(tile.x + 1, tile.y)); //ok 20_44
        if (tile.y + 1 < maxY) {
          adjacentTiles.push(this._mapModel.getTile(tile.x + 1, tile.y + 1)); //ok 20_45
        }
      }
      if (tile.y - 1 >= 0) adjacentTiles.push(this._mapModel.getTile(tile.x, tile.y - 1)); //ok 19_43
    }

    return adjacentTiles.filter((tile) => this._tileConditionFunc(tile));
  }

  // Getters & Setters
  get segmentTiles(): TileModel[] {
    return this._segmentTiles;
  }

  set segmentTiles(value: TileModel[]) {
    this._segmentTiles = value;
  }
  get tileConditionFunc(): (tile: TileModel) => boolean {
    return this._tileConditionFunc;
  }

  set tileConditionFunc(value: (tile: TileModel) => boolean) {
    this._tileConditionFunc = value;
  }
  get mapModel(): MapModel {
    return this._mapModel;
  }

  set mapModel(value: MapModel) {
    this._mapModel = value;
  }
}
