import { Sport } from '../../../core/singleton/Sport.ts';
import { IStatIncrease } from '../../object/model/UsableObject.ts';
import { ObjectRarity } from '../../object/model/ObjectRarity.ts';

export class Statistics extends Map<Sport, number> {
  public constructor(stats: Map<Sport, number> | Statistics = new Map<Sport, number>()) {
    super();
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

  public static createFromJsObject(jsObject: IStatIncrease[], rarity?: ObjectRarity): Statistics {
    const stats = new Statistics();
    for (const stat of jsObject) {
      // todo check if the sport is in the object
      const sport = Sport.getByName(stat.sport);
      const bonus = rarity ? Math.floor(((stat.bonus + 1) / 3) * rarity.bonus) : stat.bonus;
      if (sport) stats.set(sport, bonus);
    }
    return stats;
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

  public copy(): Statistics {
    return new Statistics(this);
  }

  static initRandomStats(totalStats: number = 60, minStats: number = 5): Map<Sport, number> {
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
