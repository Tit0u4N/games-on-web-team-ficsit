import { DicePresenter } from '../presenter/DicePresenter.ts';

describe('Building model', () => {
  let presenter: DicePresenter;

  beforeEach(() => {
    presenter = new DicePresenter();
  });

  it('should be defined', () => {
    expect(presenter).toBeDefined();
  });
});
