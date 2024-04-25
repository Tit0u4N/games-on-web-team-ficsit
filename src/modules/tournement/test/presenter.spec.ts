import { TournamentPresenter } from '../presenter/TournamentPresenter.ts';

describe('Building model', () => {
  let presenter: TournamentPresenter;

  beforeEach(() => {
    presenter = new TournamentPresenter();
  });

  it('should be defined', () => {
    expect(presenter).toBeDefined();
  });
});
