import { Presenter } from '../presenter/Presenter.ts';

describe('Building model', () => {
  let presenter: Presenter;

  beforeEach(() => {
    presenter = new Presenter();
  });

  it('should be defined', () => {
    expect(presenter).toBeDefined();
  });
});
