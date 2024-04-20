import { Sport } from '../model/Sport.ts';

describe('Building model', () => {
  let model: Sport;

  beforeEach(() => {
    model = new Sport();
  });

  it('should be defined', () => {
    expect(model).toBeDefined();
  });
});
