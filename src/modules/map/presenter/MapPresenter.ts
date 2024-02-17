import { MapModel } from '../model/MapModel.ts';
import { MapView } from '../view/Babylon/MapView.ts';
import { Scene } from '@babylonjs/core';

type MapPresenterOptions = {
  size?: number;
  seed?: number | string;
};

const DEFAULT_OPTIONS: Readonly<MapPresenterOptions> = Object.freeze({
  size: 100,
  seed: Math.random(),
});
export class MapPresenter {
  private _mapModel: MapModel;
  private _view: MapView;

  constructor(scene: Scene, options: MapPresenterOptions = {}) {
    const finalOptions = { ...DEFAULT_OPTIONS, ...options };
    this._mapModel = new MapModel(finalOptions.size!, finalOptions.seed);
    this._view = new MapView(scene, this._mapModel);
  }
}
