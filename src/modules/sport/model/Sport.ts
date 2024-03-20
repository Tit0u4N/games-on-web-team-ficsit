export class Sport {
  private sportType: SportType;

  constructor(sportType: SportType) {
    this.sportType = sportType;
  }

  get getType(): SportType {
    return this.sportType;
  }

  set setType(sportType: SportType) {
    this.sportType = sportType;
  }
}

export enum SportType {
  ATHLETISM = 'Athletism',
  NATAION = 'Natation',
  ESCALADE = 'Escalade',
  SKI = 'Ski',
  SKATING = 'Skating',
}
