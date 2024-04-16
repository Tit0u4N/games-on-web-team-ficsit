import { ArenaModel } from '../model/ArenaModel.ts';
import { ArenaView } from '../view/Babylon/ArenaView.ts';
import { Reactable, ViewInitable } from '../../../core/Interfaces.ts';
import { Scene } from '@babylonjs/core';
import { ArenaLayout, ArenaLayoutProps } from '../view/React/ArenaLayout.tsx';
import { ModalManager } from '../../../core/ModalManager.ts';
import React from 'react';

export class ArenaPresenter implements ViewInitable, Reactable {
  private readonly _arena: ArenaModel;
  private _arenaView: ArenaView;
  private _modalIsOpen: boolean;

  constructor(arena: ArenaModel) {
    this._arena = arena;
    this._arenaView = new ArenaView(this);
    this._modalIsOpen = false;
  }

  initView(scene: Scene) {
    this._arenaView.initView(scene);
  }

  get arena(): ArenaModel {
    return this._arena;
  }

  get arenaView(): ArenaView {
    return this._arenaView;
  }

  unMountView(): void {
    this._arenaView.unMountView();
  }

  public openModal(): void {
    this._modalIsOpen = true;
    ModalManager.getInstance().openModal(this);
  }

  public closeModal(): void {
    this._modalIsOpen = false;
    ModalManager.getInstance().closeModal();
  }

  getReactView(): { type: React.ElementType; props: ArenaLayoutProps } {
    return {
      type: ArenaLayout,
      props: {
        arena: this._arena,
        isOpen: this._modalIsOpen,
        onClose: () => this.closeModal(),
      },
    };
  }
}
