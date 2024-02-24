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

  /* Application management*/

  public getStatus() {
    return this.status;
  }

  /* Events management */

  public subscribeToViewChanges(listener: () => void) {
    this.viewChangeListeners.push(listener);
  }

  notifyViewChange() {
    this.viewChangeListeners.forEach((listener) => listener());
  }

  /* Game logic */

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

  getBabylonViewSetup() {
    return {
      onSceneReady: this.babylonView.getOnSceneReady(),
      onRender: this.babylonView.getOnRender(),
    };
  }
}
