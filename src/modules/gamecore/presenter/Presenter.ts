import { GameCoreModel } from '../model/Model.ts';
import { BabylonView } from '../view/Babylon/View.ts';
import { ApplicationStatus } from './ApplicationStatus.ts';

export class GameCorePresenter {
  private gameModel: GameCoreModel;
  private status: ApplicationStatus;
  private viewChangeListeners: (() => void)[] = [];
  private babylonView: BabylonView;

  constructor() {
    this.gameModel = new GameCoreModel();
    this.status = ApplicationStatus.MENU;
    this.babylonView = new BabylonView();
  }

  /* Application management*/

  public getStatus() {
    return this.status;
  }

  /* Events management */

  /**
   * Subscribe to changes
   * @param listener - listener to subscribe
   */
  public subscribeToViewChanges(listener: () => void) {
    this.viewChangeListeners.push(listener);
  }

  /**
   * Notify view for changes
   */
  notifyViewChange() {
    this.viewChangeListeners.forEach((listener) => listener());
  }

  /* Game logic */

  /**
   * Start a new game
   */
  startGame() {
    this.gameModel.createNewGame();
    this.status = ApplicationStatus.GAME;
    this.babylonView.init();
    this.notifyViewChange();
  }

  /**
   * Start a new round
   */
  nextRound() {
    this.gameModel.playRound();
    this.notifyViewChange();
  }

  getCurrentRound() {
    return this.gameModel.getRound();
  }

  /**
   * Get Babylon view setup
   */
  getBabylonViewSetup() {
    return {
      onSceneReady: this.babylonView.getOnSceneReady(),
      onRender: this.babylonView.getOnRender(),
    };
  }
}
