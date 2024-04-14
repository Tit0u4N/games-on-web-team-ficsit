import { ArenaModel } from '../model/ArenaModel.ts';
import { ArenaView } from '../view/Babylon/ArenaView.ts';
import { Reactable, ViewInitable } from '../../../core/Interfaces.ts';
import { Scene } from '@babylonjs/core';
import React from 'react';
import { ArenaLayout, ArenaLayoutProps } from '../view/React/ArenaLayout.tsx';

export class ArenaPresenter implements ViewInitable, Reactable {
  private readonly _arena: ArenaModel;
  private _arenaView: ArenaView;
  private setViewModelFunc: (presenter: Reactable) => void;

  constructor(arena: ArenaModel, setViewModelFunc: (presenter: Reactable) => void) {
    this._arena = arena;
    this._arenaView = new ArenaView(this);
    this.setViewModelFunc = setViewModelFunc;
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
    this.setViewModelFunc(this);
  }

  getReactView(): { type: React.ElementType; props: ArenaLayoutProps } {
    return {
      type: ArenaLayout,
      props: {
        arena: this._arena,
      },
    };
  }
}
