import { BuildingFactory } from '../model/BuildingFactory.ts';
import { Scene } from '@babylonjs/core';
import { MapPresenter } from '../../map/presenter/MapPresenter.ts';
import { Reactable, ViewInitable } from '../../../core/Interfaces.ts';
import { ArenaPresenter } from './ArenaPresenter.ts';
import { TrainingCenterPresenter } from './TrainingCenterPresenter.ts';

export class BuildingPresenter implements ViewInitable {
  private _arenasPresenter: ArenaPresenter[] = [];
  private _trainingCenterPresenter: TrainingCenterPresenter[] = [];
  private buildingFactory: BuildingFactory;
  private _scene!: Scene;

  constructor(mapPresenter: MapPresenter, openModal: (presenter: Reactable) => void) {
    this.buildingFactory = new BuildingFactory(mapPresenter, openModal);
    this._arenasPresenter = this.buildingFactory.createArenas();
    this._trainingCenterPresenter = this.buildingFactory.createTrainingCenters();
  }

  initView(scene: Scene) {
    this._scene = scene;
    this._arenasPresenter.forEach((arenaPresenter) => {
      arenaPresenter.initView(scene);
    });
    this._trainingCenterPresenter.forEach((trainingCenterPresenter) => {
      trainingCenterPresenter.initView(scene);
    });
  }

  get arenas(): ArenaPresenter[] {
    return this._arenasPresenter;
  }

  get trainingCenters(): TrainingCenterPresenter[] {
    return this._trainingCenterPresenter;
  }

  get scene(): Scene {
    return this._scene;
  }

  unMountView(): void {
    this._arenasPresenter.forEach((arenaPresenter) => {
      arenaPresenter.unMountView();
    });
    this._trainingCenterPresenter.forEach((trainingCenterPresenter) => {
      trainingCenterPresenter.unMountView();
    });
  }
}
