import { CharacterPresenter } from '../presenter/CharacterPresenter.ts';

describe('Building model', () => {
  let presenter: CharacterPresenter;

  beforeEach(() => {
    presenter = new CharacterPresenter();
  });

  it('should be defined', () => {
    expect(presenter).toBeDefined();
  });
});
