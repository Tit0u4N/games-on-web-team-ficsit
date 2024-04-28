import { Sport } from '../../../core/singleton/Sport.ts';
import { config } from '../../../core/Interfaces.ts';

export class Statistics extends Map<Sport, number> {
  public constructor(stats: Map<Sport, number> | Statistics = new Map<Sport, number>()) {
    super();
    if (config.statistics.setDefaultStats) this.initRandomStats();
    for (const [sport, value] of stats) {
      this.set(sport, value);
    }
  }

  public static createFromJsObject(jsObject: { sport: string; bonus: number }[]): Statistics {
    const stats = new Statistics();
    for (const stat of jsObject) {
      // todo check if the sport is in the object
      const sport = Sport.getByName(stat.sport);
      if (sport) stats.set(sport, stat.bonus);
    }
    return stats;
  }

  public initRandomStats(): void {
    // Share not equitably the statsToShare between all sports and downgrades the statsToShare
    for (const sport of Sport.getAll()) {
      // the stats can be between 2 and 13
      this.set(sport, Math.floor(Math.random() * 12) + 2);
    }
    console.log(this);
  }

  get(sport: Sport): number {
    return super.get(sport) || 0;
  }

  //@ts-ignore
  set(sport: Sport, value: number): Statistics {
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
}
