import { Sport, SportType } from '../../sport/model/Sport';
import { config } from '../../../core/Interfaces.ts';

export class Statistics {
  private readonly _stats: Map<Sport, number>;

  public constructor(stats: Map<Sport, number> = new Map<Sport, number>()) {
    console.log(Object.values(SportType));
    this._stats = config.statistics.setDefaultStats ? Statistics.createRandomStats() : stats;
  }

  public static createFromJsObject(jsObject: object): Statistics {
    const stats = new Map<Sport, number>();
    for (const sport of Object.values(SportType)) {
      stats.set(new Sport(sport), jsObject[sport]);
    }
    return new Statistics(stats);
  }

  public static createRandomStats(): Map<Sport, number> {
    const stats = new Map<Sport, number>();
    // Share not equitably the statsToShare between all sports and downgrades the statsToShare
    for (const sportType of Object.values(SportType)) {
      // the stats can be between 2 and 13
      stats.set(new Sport(sportType), Math.floor(Math.random() * 12) + 2);
    }
    console.log(stats);
    return stats;
  }

  get stats(): Map<Sport, number> {
    return this._stats;
  }

  public getStat(sport: Sport): number {
    return this._stats.get(sport) || 0;
  }

  public setStat(sport: Sport, value: number): void {
    if (value < 0) {
      value = 0;
    } else if (value > 20) {
      value = 20;
    }
    this._stats.set(sport, value);
  }

  public addStat(statistics: Statistics): Statistics {
    const newStats: Statistics = new Statistics();
    for (const [sport, value] of this._stats) {
      newStats.setStat(sport, value + statistics.getStat(sport));
    }
    return newStats;
  }
}
