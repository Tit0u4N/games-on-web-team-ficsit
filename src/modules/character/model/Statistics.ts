import { Sport } from '../../../core/singleton/Sport.ts';
import { config } from '../../../core/Interfaces.ts';
import { IStatIncrease } from '../../object/model/UsableObject.ts';

export class Statistics extends Map<Sport, number> {
  public constructor(stats: Map<Sport, number> | Statistics = new Map<Sport, number>()) {
    super();
    if (config.statistics.setDefaultStats && !stats) this.initRandomStats();
    for (const [sport, value] of stats) {
      this.set(sport, value);
    }
  }

  public static createFromJsObject(jsObject: IStatIncrease[]): Statistics {
    const stats = new Statistics();
    for (const stat of jsObject) {
      // todo check if the sport is in the object
      const sport = Sport.getByName(stat.sport);
      if (sport) stats.set(sport, stat.bonus);
    }
    return stats;
  }

  public initRandomStats(): void {
    const randomStats = Statistics.initRandomStats(100, 5);
    for (const [sport, value] of randomStats) {
      this.set(sport, value);
    }
  }

  get(sport: Sport): number {
    return super.get(sport) || 0;
  }

  set(sport: Sport, value: number): this {
    if (value < 0) {
      value = 0;
    } else if (value > 20) {
      value = 20;
    }
    return super.set(sport, value);
  }

  public addStat(statistics: Statistics): Statistics {
    const newStats: Statistics = new Statistics();
    for (const [sport, value] of this) {
      newStats.set(sport, value + statistics.get(sport));
    }
    return newStats;
  }

  public copy(): Statistics {
    return new Statistics(this);
  }

  static initRandomStats(totalStats: number = 80, minStats: number = 5): Map<Sport, number> {
    const stats = new Map<Sport, number>();
    for (const sport of Sport.getAll()) {
      stats.set(sport, minStats);
      totalStats -= minStats;
    }
    while (totalStats > 0) {
      const sport = Sport.getRandom();
      let value = Math.floor(Math.random() * 4);
      const currentValue = stats.get(sport);
      if (!currentValue) continue;
      if (value > totalStats) value = totalStats;
      if (currentValue + value > 20) value = 20 - currentValue;
      stats.set(sport, currentValue + value);
      totalStats -= value;
    }
    return stats;
  }
}
