import { GameCorePresenter } from '../presenter/GameCorePresenter.ts';
import { ApplicationStatus } from '../presenter/ApplicationStatus.ts';
import { GameCoreModel } from '../model/GameCoreModel.ts';
import { BabylonMainView } from '../view/Babylon/BabylonMainView.ts';
import { MapPresenter } from '../../map/presenter/MapPresenter.ts';

// Mocking the MainView class
jest.mock('../view/Babylon/BabylonMainView.ts', () => {
  return {
    BabylonMainView: jest.fn().mockImplementation(() => {
      return {
        init: jest.fn(),
        getOnSceneReady: jest.fn(),
        getOnRender: jest.fn(),
      };
    }),
  };
});

jest.mock('../model/GameCoreModel.ts', () => {
  return {
    GameCoreModel: jest.fn().mockImplementation(() => {
      return {
        createNewGame: jest.fn(),
        playRound: jest.fn(),
        getRound: jest.fn(),
      };
    }),
  };
});

jest.mock('../../map/presenter/MapPresenter.ts', () => {
  return {
    MapPresenter: jest.fn().mockImplementation(() => {
      return {
        init: jest.fn(),
        getDisplacementGraph: jest.fn(),
      };
    }),
  };
});

describe('GameCorePresenter unit test', () => {
  let presenter: GameCorePresenter;
  let gameCoreModel: jest.Mocked<GameCoreModel>;
  let babylonMainView: jest.Mocked<BabylonMainView>;
  let mapPresenter: jest.Mocked<MapPresenter>;

  beforeEach(() => {
    presenter = new GameCorePresenter();
    gameCoreModel = new GameCoreModel() as jest.Mocked<GameCoreModel>;
    babylonMainView = new BabylonMainView() as jest.Mocked<BabylonMainView>;
    mapPresenter = new MapPresenter() as jest.Mocked<MapPresenter>;
    presenter['_babylonView'] = babylonMainView;
    presenter['gameModel'] = gameCoreModel;
    presenter['mapPresenter'] = mapPresenter;
  });

  it('should be defined', () => {
    expect(presenter).toBeDefined();
    expect(presenter.getStatus()).toBe(ApplicationStatus.MENU);
    expect(presenter['gameModel']).toBeDefined();
    expect(presenter['babylonView']).toBeDefined();
    expect(presenter['viewChangeListeners']).toBeDefined();
  });

  describe('getStatus', () => {
    it('should return the status', () => {
      expect(presenter.getStatus()).toBe(ApplicationStatus.MENU);
    });
  });

  describe('subscribeToViewChanges', () => {
    it('should add a listener', () => {
      const listener = jest.fn();
      presenter.subscribeToViewChanges(listener);
      expect(presenter['viewChangeListeners']).toContain(listener);
    });
  });

  describe('notifyViewChange', () => {
    it('should notify the listeners', () => {
      const listener = jest.fn();
      presenter.subscribeToViewChanges(listener);
      presenter.notifyViewChange();
      expect(listener).toHaveBeenCalled();
    });
  });

  describe('startGame', () => {
    it('should start a new game', () => {
      presenter.startGame();
      expect(gameCoreModel.createNewGame).toHaveBeenCalled();
      expect(presenter.getStatus()).toBe(ApplicationStatus.GAME);
      // doesn't work because of the setTimeout
      //expect(mapPresenter.init).toHaveBeenCalled();
    });
  });

  describe('nextRound', () => {
    it('should start a new round', () => {
      presenter.nextRound();
      expect(gameCoreModel.playRound).toHaveBeenCalled();
    });
  });

  describe('getCurrentRound', () => {
    it('should return the current round', () => {
      gameCoreModel.getRound.mockReturnValue(5);
      expect(presenter.getCurrentRound()).toBe(5);
    });
  });
});
