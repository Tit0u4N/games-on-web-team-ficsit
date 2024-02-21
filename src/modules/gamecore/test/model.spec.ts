import { GameCoreModel } from '../model/Model.ts';

describe('Building model', () => {
  let model: GameCoreModel;

  beforeEach(() => {
    model = new GameCoreModel();
  });

  it('should be defined', () => {
    expect(model).toBeDefined();
  });
});
