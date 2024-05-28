import { Reactable } from '@core/Interfaces.ts';
import React from 'react';

export class ModalManager {
  private static _instance: ModalManager;
  private readonly setModalUseState: (presenter: Reactable | null) => void;
  private _currentModal: Reactable | null = null;
  private _isLocked = false;
  private _modalUpdaterHandler!: React.Dispatch<React.SetStateAction<boolean>>;

  private constructor(setModal: (presenter: Reactable | null) => void) {
    this.setModalUseState = setModal;
  }

  public static createInstance(setModal: (presenter: Reactable | null) => void): ModalManager {
    ModalManager._instance = new ModalManager(setModal);
    return ModalManager._instance;
  }
  public static getInstance(): ModalManager {
    if (!ModalManager._instance) {
      throw new Error('ModalManager not created');
    }
    return ModalManager._instance;
  }

  private setModal(modal: Reactable | null, force: boolean = false) {
    if (this._isLocked && !force) {
      return this;
    }
    this._currentModal = modal;
    this.setModalUseState(modal);
    return this;
  }

  public openModal(modal: Reactable, force: boolean = false): ModalManager {
    return this.setModal(modal, force);
  }

  public closeModal(force: boolean = false): ModalManager {
    return this.setModal(null, force);
  }

  public lock(): ModalManager {
    this._isLocked = true;
    return this;
  }

  public unlock(): ModalManager {
    this._isLocked = false;
    return this;
  }

  public updateCurrentModal(): ModalManager {
    if (this._modalUpdaterHandler) {
      this._modalUpdaterHandler((prev) => !prev);
    }
    return this;
  }

  set modalUpdaterHandler(handler: React.Dispatch<React.SetStateAction<boolean>>) {
    this._modalUpdaterHandler = handler;
  }

  get currentModal(): Reactable | null {
    return this._currentModal;
  }

  public isModalOpen(): boolean {
    return this._currentModal !== null;
  }

  public isLocked(): boolean {
    return this._isLocked;
  }
}
