import { TileView } from './TileView.ts';
import { TileViewFactory } from './TileViewFactory.ts';
import { IMap } from '../../model/MapModel.ts';
import { Mesh, Scene } from '@babylonjs/core';
import { TypesTile } from '../../model/TileModel.ts';
import { Arena } from '../../../building/model/ArenaModel.ts';

/**
 * Map class for the game
 * Contains hexagons tiles and have a size (square)
 */
export class MapView {
  private size: number;
  private tiles!: TileView[][];
  private parent!: Mesh;
  private scene!: Scene;
  private readonly _mapModel: IMap;
  private _arena: Arena[] = [];

  constructor(mapModel: IMap) {
    this.size = mapModel.size;
    this._mapModel = mapModel;
  }

  init(scene: Scene) {
    this.scene = scene;
    this.parent = new Mesh('map_group');
    this.tiles = this.mapModelToView(this._mapModel);
    if (this.tiles.length === 0) throw new Error('No tiles found');
  }

  /**
   * @private
   * Create map tiles from the model
   * @param mapModel
   * @returns TileView[][]
   */
  private mapModelToView(mapModel: IMap): TileView[][] {
    const tileFactory = new TileViewFactory(this.scene);
    const tempTiles: TileView[][] = [];

    for (let x = 0; x < this.size; x++) {
      tempTiles.push([]);
      for (let y = 0; y < this.size; y++) {
        const tempTileModel = mapModel.getTile(x, y);
        if (!tempTileModel) throw new Error(`Tile not found at ${x}, ${y}`);
        const tempTile = tileFactory.createTile(x, y, tempTileModel.type, this);
        this.parent.addChild(tempTile.mesh);
        tempTiles[x].push(tempTile);
        const notConstructible = [TypesTile.MOUNTAIN, TypesTile.DEEP_WATER, TypesTile.WATER, TypesTile.SNOW];
        if (!notConstructible.includes(tempTileModel.type) && Math.random() > 0.99) {
          this._arena.push(tileFactory.createArena(tempTile));
        }
      }
    }

    return tempTiles;
  }

  get mapModel(): IMap {
    return this._mapModel;
  }

  get arena(): Arena[] {
    return this._arena;
  }
}
