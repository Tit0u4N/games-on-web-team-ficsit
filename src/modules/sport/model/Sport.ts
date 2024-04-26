export class Sport {
  private _type: SportType;

  constructor(type: SportType) {
    this._type = type;
  }

  get type(): SportType {
    return this._type;
  }

  set type(sportType: SportType) {
    this._type = sportType;
  }
}

export enum SportType {
  ATHLETISM = 'Athletism',
  NATATION = 'Natation',
  ESCALADE = 'Escalade',
  SKI = 'Ski',
  SKATING = 'Skating',
  BASEBALL = 'Baseball',
  SOCCER = 'Soccer',
  BASKETBALL = 'Basketball',
  HOCKEY = 'Hockey',
  VOLLEYBALL = 'Volleyball',
  RUGBY = 'Rugby',
  TENNIS = 'Tennis',
  TABLE_TENNIS = 'Table Tennis',
  BOXING = 'Boxing',
  FENCING = 'Fencing',
}
