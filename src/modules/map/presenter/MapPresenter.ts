import { MapModel } from '../model/MapModel.ts';
import { MapView } from '../view/Babylon/MapView.ts';
import { Scene } from '@babylonjs/core';

export class MapPresenter {
  private _mapModel: MapModel;
  private _view: MapView;

  constructor(scene: Scene) {
    this._mapModel = new MapModel(100);
    this._view = new MapView(scene, this._mapModel);
  }
}
