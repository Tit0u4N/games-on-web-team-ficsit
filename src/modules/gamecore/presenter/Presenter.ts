import { MainView } from '../view/React/MainView.tsx';

export class GameCorePresenter {
  private mainView: MainView;
  constructor() {
    console.log('Presenter created');
    this.mainView = new MainView(this);
  }

  init() {
    console.log('Presenter init');
    this.mainView.init();
  }
}
