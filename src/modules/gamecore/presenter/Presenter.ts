import { MainView } from '../view/React/MainView.tsx';
import { GameCoreModel } from '../model/Model.ts';

export class GameCorePresenter {
  private mainView: MainView;
  private gameModel: GameCoreModel;
  constructor() {
    this.mainView = new MainView(this);
    this.gameModel = new GameCoreModel();
  }

  init() {
    this.mainView.init();
  }

  startGame() {
    this.mainView.startNewGame();
    this.gameModel.createNewGame();
  }

  nextRound() {
    this.gameModel.playRound();
    this.mainView.notifyViewChange();
  }

  getCurrentRound() {
    return this.gameModel.getRound();
  }
}
