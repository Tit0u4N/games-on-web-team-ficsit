import { Reactable } from './Interfaces.ts';

export class ModalManager {
  private static _instance: ModalManager;
  private setModal: (presenter: Reactable | null) => void;
  private constructor(setModal: (presenter: Reactable | null) => void) {
    this.setModal = setModal;
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

  public openModal(modal: Reactable): void {
    this.setModal(modal);
  }

  public closeModal(): void {
    this.setModal(null);
  }
}
