import { GameModel } from './GameModel.ts';

export class GameCoreModel {
  private currentGame: GameModel = new GameModel();

  public createNewGame() {
    this.currentGame = new GameModel();
  }

  public playRound() {
    this.currentGame.playRound();
  }

  public getRound() {
    return this.currentGame.getRound();
  }
}
