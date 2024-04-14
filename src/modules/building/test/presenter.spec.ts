import { BuildingPresenter } from '../presenter/BuildingPresenter.ts';
import { MapPresenter } from '../../map/presenter/MapPresenter.ts';
import { GameCorePresenter } from '../../gamecore/presenter/GameCorePresenter.ts';

describe('Building model', () => {
  let presenter: BuildingPresenter;
  const mapPresenter = new MapPresenter();

  beforeEach(() => {
    const gameCorePresenter = new GameCorePresenter();
    presenter = new BuildingPresenter(mapPresenter, gameCorePresenter.setViewModalFunc);
  });

  it('should be defined', () => {
    expect(presenter).toBeDefined();
  });
});
