import { Reactable, ViewInitable } from '@core/Interfaces.ts';
import { Scene } from '@babylonjs/core';
import { TrainingCenterModel } from '../model/TrainingCenterModel.ts';
import { TrainingCenterView } from '../view/Babylon/TrainingCenterView.ts';
import React from 'react';
import { TrainingCenterLayout, TrainingCenterLayoutProps } from '../view/React/TrainingCenterLayout.tsx';
import { ModalManager } from '@core/singleton/ModalManager.ts';
import { Character } from '@character/model/Character.ts';
import { GameCorePresenter } from '@gamecore/presenter/GameCorePresenter.ts';
import { EffectType } from '../../audio/presenter/AudioPresenter.ts';

export class TrainingCenterPresenter implements ViewInitable, Reactable {
  private readonly _trainingCenter: TrainingCenterModel;
  private _trainingCenterView: TrainingCenterView;
  private _modalIsOpen: boolean;

  constructor(trainingCenterModel: TrainingCenterModel) {
    this._trainingCenter = trainingCenterModel;
    this._trainingCenterView = new TrainingCenterView(this);
    this._modalIsOpen = false;
  }

  async initView(scene: Scene) {
    await this._trainingCenterView.initView(scene);
  }

  get trainingCenter(): TrainingCenterModel {
    return this._trainingCenter;
  }

  get trainingCenterView(): TrainingCenterView {
    return this._trainingCenterView;
  }

  public openModal(): void {
    this._modalIsOpen = true;
    GameCorePresenter.AUDIO_PRESENTER.playEffect(EffectType.OPEN);
    ModalManager.getInstance().openModal(this);
  }

  public closeModal(): void {
    this._modalIsOpen = false;
    GameCorePresenter.AUDIO_PRESENTER.playEffect(EffectType.OPEN);
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

  isCharacterInBuilding(character: Character) {
    const characterTile = character.tile;
    const trainingCenterTile = this.trainingCenter.tile;
    return characterTile?.x === trainingCenterTile?.x && characterTile?.y === trainingCenterTile?.y;
  }

  onCharacterEnter(character: Character) {
    this.trainingCenter.addCharacter(character);
  }

  onCharacterExit(character: Character) {
    this.trainingCenter.removeCharacter(character);
  }
}
