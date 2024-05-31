export class GameModel {
  private round: number;

  constructor() {
    this.round = 47;
  }

  public playRound() {
    /* ... */
    this.round++;
  }

  getRound() {
    return this.round;
  }
}
