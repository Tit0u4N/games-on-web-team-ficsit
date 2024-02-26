import { IMap, MapModel } from '../model/MapModel.ts';
import { MapView } from '../view/Babylon/MapView.ts';
import { Scene } from '@babylonjs/core';
import { IGraphTiles } from '../model/GraphTilesModel.ts';

type MapPresenterOptions = {
  size?: number;
  seed?: number | string;
};

const DEFAULT_OPTIONS: Readonly<MapPresenterOptions> = Object.freeze({
  size: 100,
  seed: Math.random(),
});
export class MapPresenter {
  private _mapModel: IMap;
  private _view: MapView;

  private options: MapPresenterOptions;

  constructor(options: MapPresenterOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this._mapModel = new MapModel(this.options.size!, this.options.seed);
    this._view = new MapView(this._mapModel);
  }

  init(scene: Scene) {
    this._mapModel.init();
    this._view.init(scene);
  }

  public getDisplacementGraph(): IGraphTiles {
    return this._mapModel.displacementGraph;
  }
}
