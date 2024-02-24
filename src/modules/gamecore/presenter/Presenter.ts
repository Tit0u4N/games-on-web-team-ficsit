import { GameCoreModel } from '../model/Model.ts';
import { BabylonView } from '../view/Babylon/View.ts';

export class GameCorePresenter {
  private gameModel: GameCoreModel;
  private status: string;
  private viewChangeListeners: (() => void)[] = [];
  private babylonView: BabylonView;

  constructor() {
    this.gameModel = new GameCoreModel();
    this.status = 'menu';
    this.babylonView = new BabylonView();
  }

  startGame() {
    this.gameModel.createNewGame();
    this.status = 'game';
    this.babylonView.init();
    this.notifyViewChange();
  }

  nextRound() {
    this.gameModel.playRound();
    this.notifyViewChange();
  }

  getCurrentRound() {
    return this.gameModel.getRound();
  }

  public getStatus() {
    return this.status;
  }

  public subscribeToViewChanges(listener: () => void) {
    this.viewChangeListeners.push(listener);
  }

  notifyViewChange() {
    this.viewChangeListeners.forEach((listener) => listener());
  }

  getBabylonViewSetup() {
    return {
      onSceneReady: this.babylonView.getOnSceneReady(),
      onRender: this.babylonView.getOnRender(),
    };
  }
}
