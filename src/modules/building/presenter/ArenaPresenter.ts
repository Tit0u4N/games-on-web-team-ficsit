import { ArenaModel } from '../model/ArenaModel.ts';
import { ArenaView } from '../view/Babylon/ArenaView.ts';
import { Reactable, ViewInitable } from '../../../core/Interfaces.ts';
import { Scene } from '@babylonjs/core';
import { ArenaLayout, ArenaLayoutProps } from '../view/React/ArenaLayout.tsx';
import { ModalManager } from '../../../core/singleton/ModalManager.ts';
import React from 'react';
import { TournamentManagerPresenter } from '../../tournament/presenter/TournamentManagerPresenter.ts';
import { Sport } from '../../../core/singleton/Sport.ts';
import { TournamentPresenter } from '../../tournament/presenter/TournamentPresenter.ts';
import { TournamentDifficulty } from '../../tournament/model/TournamentDifficulty.ts';
import { BuildingPresenter } from './BuildingPresenter.ts';

export class ArenaPresenter implements ViewInitable, Reactable {
  private readonly _arena: ArenaModel;
  private readonly _tournamentManagerPresenter: TournamentManagerPresenter;
  private readonly _difficulty: TournamentDifficulty;
  private readonly _buildingPresenter: BuildingPresenter;
  private readonly _arenaView: ArenaView;
  private _modalIsOpen: boolean;
  private _tournamentPresenter!: TournamentPresenter;

  constructor(
    buildingPresenter: BuildingPresenter,
    arena: ArenaModel,
    tournamentManagerPresenter: TournamentManagerPresenter,
  ) {
    this._arena = arena;
    this._arenaView = new ArenaView(this);
    this._modalIsOpen = false;
    this._tournamentManagerPresenter = tournamentManagerPresenter;
    this._difficulty = TournamentManagerPresenter.generateDifficulty();
    this._buildingPresenter = buildingPresenter;
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
        arena: this,
        isOpen: this._modalIsOpen,
        onClose: () => this.closeModal(),
      },
    };
  }

  get tournamentManagerPresenter(): TournamentManagerPresenter {
    return this._tournamentManagerPresenter;
  }

  updateTournament(actualSport: Sport) {
    this._tournamentPresenter = this._tournamentManagerPresenter.createTournament(this._difficulty, actualSport);
  }

  hasTournament() {
    return this.tournamentPresenter !== undefined;
  }

  get tournamentPresenter(): TournamentPresenter {
    return this._tournamentPresenter;
  }

  public charactersInArena() {
    return this._buildingPresenter.gameCorePresenter.mapPresenter.getCharactersOnTile(this._arena.position);
  }

  public startTournament(): void {
    const characters = this._buildingPresenter.gameCorePresenter.mapPresenter.getCharactersOnTile(this._arena.position);
    this._tournamentPresenter.startTournament([...characters]);
    ModalManager.getInstance().updateCurrentModal();
  }
}
