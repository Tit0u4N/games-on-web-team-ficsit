import { GameCoreModel } from '../model/GameCoreModel.ts';
import { BabylonMainView } from '../view/Babylon/BabylonMainView.ts';
import { ApplicationStatus } from './ApplicationStatus.ts';

export class GameCorePresenter {
  private gameModel: GameCoreModel;
  private status: ApplicationStatus;
  private viewChangeListeners: (() => void)[] = [];
  private babylonView: BabylonMainView;

  constructor() {
    this.gameModel = new GameCoreModel();
    this.status = ApplicationStatus.MENU;
    this.babylonView = new BabylonMainView();
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
