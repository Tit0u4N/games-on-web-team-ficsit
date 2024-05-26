import { Sport } from '../../../core/singleton/Sport.ts';
import { IStatIncrease } from '../../object/model/UsableObject.ts';

export class Statistics extends Map<Sport, number> {
  public constructor(stats: Map<Sport, number> | Statistics = new Map<Sport, number>()) {
    super();
    //FIXME: if (config.statistics.setDefaultStats && (!stats || stats.size == 0)) this.initRandomStats();
    for (const [sport, value] of stats) {
      this.set(sport, value);
    }
    this.completeMissingStats();
  }

  private completeMissingStats(): void {
    for (const sport of Sport.getAll()) {
      if (!this.has(sport)) {
        this.set(sport, 0);
      }
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

  // private initRandomStats(): void {
  //   //FIXME: remove this method not used in the version in tournaments
  //   // Share not equitably the statsToShare between all sports and downgrades the statsToShare
  //   for (const sport of Sport.getAll()) {
  //     // the stats can be between 2 and 13
  //     this.set(sport, Math.floor(Math.random() * 12) + 2);
  //   }
  // }

  public copy(): Statistics {
    return new Statistics(this);
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

  public addStat(statistics: Statistics): void {
    for (const [sport, value] of this) {
      this.set(sport, value + statistics.get(sport));
    }
  }
}
