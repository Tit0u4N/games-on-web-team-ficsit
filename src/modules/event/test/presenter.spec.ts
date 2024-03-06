import { EventPresenter } from '../presenter/EventPresenter.ts';

describe('Building model', () => {
  let presenter: EventPresenter;

  beforeEach(() => {
    presenter = new EventPresenter();
  });

  it('should be defined', () => {
    expect(presenter).toBeDefined();
  });
});
