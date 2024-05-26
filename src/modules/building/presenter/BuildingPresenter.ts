import { BuildingFactory } from '@building/model/BuildingFactory.ts';
import { Scene } from '@babylonjs/core';
import { MapPresenter } from '@map/presenter/MapPresenter.ts';
import { ViewInitable } from '@/core/Interfaces.ts';
import { ArenaPresenter } from './ArenaPresenter.ts';
import { TrainingCenterPresenter } from './TrainingCenterPresenter.ts';
import { State } from '../view/React/TrainingCenterLayout.tsx';

export class BuildingPresenter implements ViewInitable {
  private _arenasPresenter: ArenaPresenter[] = [];
  private _trainingCenterPresenter: TrainingCenterPresenter[] = [];
  private buildingFactory: BuildingFactory;
  private _scene!: Scene;

  constructor(mapPresenter: MapPresenter) {
    this.buildingFactory = new BuildingFactory(mapPresenter);
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

  /**
   * Check if all characters are ready to start a new round
   * They are ready when they are not inside a building or if their state is not CHOICE_CARD
   * @returns {boolean} - true if all characters are ready
   */
  isAllCharactersReady(): boolean {
    return this._trainingCenterPresenter.every((trainingCenter) => {
      return Array.from(trainingCenter.trainingCenter.differentStates.values()).every((state) => {
        return state.state !== State.CARDS_CHOICE;
      });
    });
  }
}
