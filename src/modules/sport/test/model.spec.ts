import { Sport, SportType } from '../model/Sport.ts';

describe('Building model', () => {
  let model: Sport;

  beforeEach(() => {
    model = new Sport(SportType.ATHLETISM);
  });

  it('should be defined', () => {
    expect(model).toBeDefined();
  });
});
