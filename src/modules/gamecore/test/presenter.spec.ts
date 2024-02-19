import { GameCorePresenter } from '../presenter/Presenter.ts';

describe('Building model', () => {
  let presenter: GameCorePresenter;

  beforeEach(() => {
    presenter = new GameCorePresenter();
  });

  it('should be defined', () => {
    expect(presenter).toBeDefined();
  });
});
