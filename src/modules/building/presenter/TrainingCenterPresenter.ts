import { ViewInitable } from '../../../core/Interfaces.ts';
import { Scene } from '@babylonjs/core';
import { TrainingCenterModel } from '../model/TrainingCenterModel.ts';
import { TrainingCenterView } from '../view/Babylon/TrainingCenterView.ts';

export class TrainingCenterPresenter implements ViewInitable {
  private readonly _trainingCenter: TrainingCenterModel;
  private _trainingCenterView: TrainingCenterView;

  constructor(trainingCenterModel: TrainingCenterModel) {
    this._trainingCenter = trainingCenterModel;
    this._trainingCenterView = new TrainingCenterView(this);
  }

  initView(scene: Scene) {
    this._trainingCenterView.initView(scene);
  }

  get trainingCenter(): TrainingCenterModel {
    return this._trainingCenter;
  }

  get trainingCenterView(): TrainingCenterView {
    return this._trainingCenterView;
  }

  unMountView(): void {
    this._trainingCenterView.unMountView();
  }
}
