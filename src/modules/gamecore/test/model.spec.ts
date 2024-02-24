import { GameCoreModel } from '../model/GameCoreModel.ts';

describe('Building model', () => {
  let model: GameCoreModel;

  beforeEach(() => {
    model = new GameCoreModel();
  });

  it('should be defined', () => {
    expect(model).toBeDefined();
  });
});
