import { DiceModel } from '../model/DiceModel.ts';

describe('Building model', () => {
  let model: DiceModel;

  beforeEach(() => {
    model = new DiceModel();
  });

  it('should be defined', () => {
    expect(model).toBeDefined();
  });
});
