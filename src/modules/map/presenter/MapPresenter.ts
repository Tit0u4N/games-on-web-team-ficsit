import { IMapModelPresenter, MapModel } from '../model/MapModel.ts';
import { MapView } from '../view/Babylon/MapView.ts';
import { Scene, Vector3 } from '@babylonjs/core';
import { IGraphTiles } from '../model/GraphTilesModel.ts';
import { importModel } from '../../../core/ModelImporter.ts';
import { getPosition } from '../core/GamePlacer.ts';

type MapPresenterOptions = {
  size?: number;
  seed?: number | string;
};

const DEFAULT_OPTIONS: Readonly<MapPresenterOptions> = Object.freeze({
  size: 100,
  seed: Math.random(),
});
export class MapPresenter {
  private _mapModel: IMapModelPresenter;
  private _view: MapView;

  private options: MapPresenterOptions;

  constructor(options: MapPresenterOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this._mapModel = new MapModel(this.options.size!, this.options.seed);
    this._view = new MapView(this._mapModel);
  }

  async init(scene: Scene) {
    this._mapModel.init();
    this._view.init(scene);
    const mesh = await importModel('', '', 'scene.gltf', scene);
    mesh.position = getPosition(this._view.getTile(12, 25) as never);
    mesh.scaling = new Vector3(0.2, 0.2, 0.2);
    mesh.rotation = new Vector3(0, -Math.PI / 2, 0);
    const mesh2 = await importModel('', '', 'trees.gltf', scene);
    mesh2.position = getPosition(this._view.getTile(12, 24) as never);
    mesh2.scaling = new Vector3(1, 1, 1);
    mesh2.rotation = new Vector3(0, 0, 0);
  }

  public getDisplacementGraph(): IGraphTiles {
    return this._mapModel.displacementGraph;
  }
}
