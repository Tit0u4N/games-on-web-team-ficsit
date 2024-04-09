import { BuildingPresenter } from '../presenter/BuildingPresenter.ts';
import { MapPresenter } from '../../map/presenter/MapPresenter.ts';

describe('Building model', () => {
  let presenter: BuildingPresenter;
  const mapPresenter = new MapPresenter();

  beforeEach(() => {
    presenter = new BuildingPresenter(mapPresenter);
  });

  it('should be defined', () => {
    expect(presenter).toBeDefined();
  });
});
