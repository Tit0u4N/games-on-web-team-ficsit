import { Reactable, ViewInitable } from '@/core/Interfaces.ts';
import { Scene } from '@babylonjs/core';
import { TrainingCenterModel } from '@building/model/TrainingCenterModel.ts';
import { TrainingCenterView } from '@building/view/Babylon/TrainingCenterView.ts';
import React from 'react';
import { TrainingCenterLayout, TrainingCenterLayoutProps } from '@building/view/React/TrainingCenterLayout.tsx';
import { ModalManager } from '@/core/singleton/ModalManager.ts';

export class TrainingCenterPresenter implements ViewInitable, Reactable {
  private readonly _trainingCenter: TrainingCenterModel;
  private _trainingCenterView: TrainingCenterView;
  private _modalIsOpen: boolean;

  constructor(trainingCenterModel: TrainingCenterModel) {
    this._trainingCenter = trainingCenterModel;
    this._trainingCenterView = new TrainingCenterView(this);
    this._modalIsOpen = false;
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
    this._modalIsOpen = true;
    ModalManager.getInstance().openModal(this);
  }

  public closeModal(): void {
    this._modalIsOpen = false;
    ModalManager.getInstance().closeModal();
  }

  getReactView(): { type: React.ElementType; props: TrainingCenterLayoutProps } {
    return {
      type: TrainingCenterLayout,
      props: {
        trainingCenter: this._trainingCenter,
        isOpen: this._modalIsOpen,
        onClose: () => this.closeModal(),
      },
    };
  }

  unMountView(): void {
    this._trainingCenterView.unMountView();
  }
}
