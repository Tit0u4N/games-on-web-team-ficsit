export class Sport {
  private sport: SportType;

  constructor(sport: SportType) {
    this.sport = sport;
  }

  public getSport(): SportType {
    return this.sport;
  }

  public setSport(sport: SportType): void {
    this.sport = sport;
  }
}

export enum SportType {
  ATHLETISM = 'Athletism',
  NATAION = 'Natation',
  ESCALADE = 'Escalade',
  SKI = 'Ski',
  SKATING = 'Skating',
}
