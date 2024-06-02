import { UsableObject } from '@object/model/UsableObject.ts';

export class RewardModel {
  private readonly _reward: UsableObject;
  private readonly _minRankToReach: number;
  private readonly _rankToReach: number;
  private readonly _keepIfBetterReward: boolean;

  constructor(reward: UsableObject, minRankToReach: number, rankToReach: number, keepIfBetterReward: boolean = false) {
    this._reward = reward;
    this._minRankToReach = minRankToReach;
    this._rankToReach = rankToReach;
    this._keepIfBetterReward = keepIfBetterReward;
  }

  get reward(): UsableObject {
    return this._reward;
  }

  get rankToReach(): number {
    return this._rankToReach;
  }

  get keepIfBetterReward(): boolean {
    return this._keepIfBetterReward;
  }

  get minRankToReach(): number {
    return this._minRankToReach;
  }
}
