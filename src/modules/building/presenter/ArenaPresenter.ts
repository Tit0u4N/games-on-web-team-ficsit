import { ArenaModel } from '../model/ArenaModel.ts';
import { ArenaView } from '../view/Babylon/ArenaView.ts';
import { Reactable, ViewInitable } from '../../../core/Interfaces.ts';
import { Scene } from '@babylonjs/core';
import { ArenaLayout, ArenaLayoutProps } from '../view/React/ArenaLayout.tsx';
import { ModalManager } from '../../../core/singleton/ModalManager.ts';
import React from 'react';
import { TournamentPresenter } from '../../tournament/presenter/TournamentPresenter.ts';

export class ArenaPresenter implements ViewInitable, Reactable {
  private _arenaModel: ArenaModel;
  private _arenaView: ArenaView;
  private _modalIsOpen: boolean;
  private scene!: Scene;

  constructor(arena: ArenaModel) {
    this._arenaModel = arena;
    this._arenaView = new ArenaView(this);
    this._modalIsOpen = false;
  }

  initView(scene: Scene) {
    this.scene = scene;
    this._arenaView.initView(scene);
  }

  get arenaModel(): ArenaModel {
    return this._arenaModel;
  }

  get arenaView(): ArenaView {
    return this._arenaView;
  }

  setTournament(tournament: TournamentPresenter): void {
    this._arenaModel.tournament = tournament;
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
        arena: this,
        isOpen: this._modalIsOpen,
        onClose: () => this.closeModal(),
      },
    };
  }
}
