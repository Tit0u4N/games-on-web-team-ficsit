import { Reactable, ViewInitable } from '../../../core/Interfaces.ts';
import { Scene } from '@babylonjs/core';
import { TrainingCenterModel } from '../model/TrainingCenterModel.ts';
import { TrainingCenterView } from '../view/Babylon/TrainingCenterView.ts';
import React from 'react';
import { TrainingCenterLayout, TrainingCenterLayoutProps } from '../view/React/TrainingCenterLayout.tsx';
import { ModalManager } from '../../../core/ModalManager.ts';

export class TrainingCenterPresenter implements ViewInitable, Reactable {
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

  public openModal(): void {
    ModalManager.getInstance().openModal(this);
  }

  getReactView(): { type: React.ElementType; props: TrainingCenterLayoutProps } {
    return {
      type: TrainingCenterLayout,
      props: {
        trainingCenter: this._trainingCenter,
      },
    };
  }

  unMountView(): void {
    this._trainingCenterView.unMountView();
  }
}
