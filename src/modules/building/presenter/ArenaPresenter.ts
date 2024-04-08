import { ArenaModel } from '../model/ArenaModel.ts';
import { ArenaView } from '../view/Babylon/ArenaView.ts';
import { ViewInitable } from '../../../core/Interfaces.ts';
import { Scene } from '@babylonjs/core';

export class ArenaPresenter implements ViewInitable {
  private readonly _arena: ArenaModel;
  private _arenaView: ArenaView;

  constructor(arena: ArenaModel) {
    this._arena = arena;
    this._arenaView = new ArenaView(this);
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
}
