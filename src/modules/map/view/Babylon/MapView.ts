import { TileView } from './TileView.ts';
import { Mesh, Scene } from '@babylonjs/core';
import { TileViewFactory } from './TileViewFactory.ts';
import { MapModel } from '../../model/MapModel.ts';

/**
 * Map class for the game
 * Contains hexagons tiles and have a size (square)
 */
export class MapView {
  private size: number;
  private tiles: TileView[][];
  private parent: Mesh;
  private scene: Scene;

  constructor(scene: Scene, mapModel: MapModel) {
    this.size = mapModel.size;
    this.parent = new Mesh('map_group');
    this.tiles = this.mapModelToView(mapModel);
    this.scene = scene;
  }

  /**
   * @private
   * Create map tiles from the model
   * @param mapModel
   * @returns TileView[][]
   */
  private mapModelToView(mapModel: MapModel): TileView[][] {
    const tileFactory = new TileViewFactory(this.scene);
    const tempTiles: TileView[][] = [];

    for (let x = 0; x < this.size; x++) {
      tempTiles.push([]);
      for (let y = 0; y < this.size; y++) {
        const tempTileModel = mapModel.getTile(x, y);
        if (!tempTileModel) throw new Error(`Tile not found at ${x}, ${y}`);
        //@ts-ignore
        const tempTile = tileFactory.createTile(x, y, tempTileModel.type);
        this.parent.addChild(tempTile.mesh);
        tempTiles[x].push(tempTile);
      }
    }

    return tempTiles;
  }
}
