export class GameCorePresenter {
  private viewChangeListeners: (() => void)[] = [];
  constructor() {
    console.log('Presenter created');
  }

  subscribeToViewChanges(listener: () => void) {
    this.viewChangeListeners.push(listener);
  }

  // Méthode pour notifier les abonnés des changements de vue
  notifyViewChange() {
    this.viewChangeListeners.forEach((listener) => listener());
  }
}
