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

  constructor(scene: Scene, options: MapPresenterOptions = {}) {
    const finalOptions = { ...DEFAULT_OPTIONS, ...options };
    this._mapModel = new MapModel(finalOptions.size!, finalOptions.seed);
    this._view = new MapView(scene, this._mapModel);
  }

  public getDisplacementGraph(): IGraphTiles {
    return this._mapModel.displacementGraph;
  }
}
