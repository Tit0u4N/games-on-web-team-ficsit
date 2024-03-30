import { BuildingPresenter } from '../presenter/BuildingPresenter.ts';

describe('Building model', () => {
  let presenter: BuildingPresenter;

  beforeEach(() => {
    presenter = new BuildingPresenter();
  });

  it('should be defined', () => {
    expect(presenter).toBeDefined();
  });
});
