import { UsableObject } from '../../object/model/UsableObject.ts';

export class RewardModel {
  private readonly _reward: UsableObject | undefined;
  private readonly _rankToReach: number;
  private readonly _keepIfBetterReward: boolean;

  constructor(reward: UsableObject | undefined, condition: number, keepIfBetterReward: boolean = false) {
    this._reward = reward;
    this._rankToReach = condition;
    this._keepIfBetterReward = keepIfBetterReward;
  }

  get reward(): UsableObject | undefined {
    return this._reward;
  }

  get rankToReach(): number {
    return this._rankToReach;
  }

  get keepIfBetterReward(): boolean {
    return this._keepIfBetterReward;
  }
}
