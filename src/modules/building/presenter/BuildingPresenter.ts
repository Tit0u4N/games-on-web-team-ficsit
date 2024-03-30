import { BuildingFactory } from '../model/BuildingFactory.ts';
import { Scene } from '@babylonjs/core';
import { MapPresenter } from '../../map/presenter/MapPresenter.ts';
import { ViewInitable } from '../../../core/Interfaces.ts';
import { ArenaPresenter } from './ArenaPresenter.ts';

export class BuildingPresenter implements ViewInitable {
  private _arenasPresenter: ArenaPresenter[] = [];
  private buildingFactory: BuildingFactory;
  private _scene!: Scene;

  constructor(mapPresenter: MapPresenter) {
    this.buildingFactory = new BuildingFactory(mapPresenter);
  }

  initView(scene: Scene) {
    this._scene = scene;
    this._arenasPresenter = this.buildingFactory.createArenas();
    this._arenasPresenter.forEach((arenaPresenter) => {
      arenaPresenter.initView(scene);
    });
  }

  get arenas(): ArenaPresenter[] {
    return this._arenasPresenter;
  }

  get scene(): Scene {
    return this._scene;
  }
}
