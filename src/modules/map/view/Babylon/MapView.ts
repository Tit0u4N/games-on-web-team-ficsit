import { TileView } from './TileView.ts';
import { TileViewFactory } from './TileViewFactory.ts';
import { IMap } from '../../model/MapModel.ts';
import { Mesh, Scene } from '@babylonjs/core';
import { ViewInitable } from '../../../../core/Interfaces.ts';
import { MapPresenter } from '../../presenter/MapPresenter.ts';
import { TypesTile } from '../../model/TileModel.ts';
import { getPosition, PositionTypes } from '../../core/GamePlacer.ts';

export interface MapLimits {
  left: number;
  right: number;
  top: number;
  bottom: number;
  cameraHeight: number;
  cameraTiltAngle: number;
}

/**
 * Map class for the game
 * Contains hexagons tiles and have a size (square)
 */
export class MapView implements ViewInitable {
  private size: number;
  private tiles!: TileView[][];
  private parent!: Mesh;
  private scene!: Scene;
  private tileFactory!: TileViewFactory;
  private tilesDeplacement: TileView[] = [];
  private readonly _mapModel: IMap;
  private readonly _mapPresenter: MapPresenter;

  constructor(mapModel: IMap, mapPresenter: MapPresenter) {
    this.size = mapModel.size;
    this._mapModel = mapModel;
    this._mapPresenter = mapPresenter;
  }

  initView(scene: Scene) {
    this.scene = scene;
    this.parent = new Mesh('map_group');
    this.tiles = this.mapModelToView(this._mapModel);
    if (this.tiles.length === 0) throw new Error('No tiles found');
    this.tileFactory = new TileViewFactory(this.scene);
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
      }
    }

    return tempTiles;
  }

  get mapModel(): IMap {
    return this._mapModel;
  }

  get mapPresenter(): MapPresenter {
    return this._mapPresenter;
  }

  getTile(x: number, y: number): TileView {
    return this.tiles[x][y];
  }

  unMountView(): void {
    throw new Error('Method not implemented.');
  }

  addDeplacementTile(x: number, y: number, type: TypesTile) {
    const TileView = this.tileFactory.createTile(x, y, TypesTile.ACCESSIBLE, this);
    TileView.mesh.position = getPosition({ x, y, type: type }, PositionTypes.DECORATION);
    this.tilesDeplacement.push(TileView);
  }

  removeDeplacementTile() {
    this.tilesDeplacement.forEach((tile) => {
      tile.mesh.dispose();
    });
    this.tilesDeplacement = [];
  }

  /**
   * Return the limit of the map in x, y and z
   * @returns MapLimits
   */
  getLimitXYZ(): MapLimits {
    const left = this.tiles[0][0].mesh.position.x - TileView.radius;
    const right = this.tiles[this.size - 1][this.size - 1].mesh.position.x + TileView.radius;
    const top = this.tiles[0][0].mesh.position.z - TileView.radius;
    const bottom = this.tiles[this.size - 1][this.size - 1].mesh.position.z + TileView.radius;

    // Add the camera's height and tilt angle to the map limits
    const cameraHeight = this.mapPresenter.gameCorePresenter.babylonView.camera!.position.y;
    const cameraTiltAngle = this.mapPresenter.gameCorePresenter.babylonView.camera!.beta;

    return {
      left,
      right,
      top,
      bottom,
      cameraHeight,
      cameraTiltAngle,
    };
  }
}
