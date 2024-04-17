import { GameCorePresenter } from '../presenter/GameCorePresenter.ts';
import { ApplicationStatus } from '../presenter/ApplicationStatus.ts';
import { GameCoreModel } from '../model/GameCoreModel.ts';
import { BabylonMainView } from '../view/Babylon/BabylonMainView.ts';
import { MapPresenter } from '../../map/presenter/MapPresenter.ts';

jest.mock('@babylonjs/core', () => ({
  ActionManager: jest.fn(),
  Color4: jest.fn(),
  ExecuteCodeAction: jest.fn(),
  Mesh: jest.fn(),
  Scene: jest.fn(),
  StandardMaterial: jest.fn(),
  Vector3: jest.fn(),
  HemisphericLight: jest.fn(),
  ArcRotateCamera: jest.fn(),
  MeshBuilder: jest.fn(),
  Texture: jest.fn(),
  SceneLoader: jest.fn(),
  Animation: jest.fn(),
  AnimationGroup: jest.fn(),
}));

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
        placeCharacters: jest.fn(),
        initView: jest.fn(),
      };
    }),
  };
});

jest.mock('../../character/presenter/CharacterPresenter.ts', () => {
  return {
    CharacterPresenter: jest.fn().mockImplementation(() => {
      return {
        getDefaultCharacters: jest.fn(),
        initView: jest.fn(),
        getSelectedCharacter: jest.fn(),
        updateSelectedCharacter: jest.fn(),
        unselectCharacter: jest.fn(),
        getCharacterView: jest.fn(),
        resetCharacterView: jest.fn(),
        resetMovements: jest.fn(),
      };
    }),
  };
});

//Mock DicePresenter
jest.mock('../../dice/presenter/DicePresenter.ts', () => {
  return {
    DicePresenter: jest.fn().mockImplementation(() => {
      return {
        rollDice: jest.fn(),
      };
    }),
  };
});

jest.mock('../../map/model/GraphTilesModel.ts', () => {
  return {
    GraphTilesModel: jest.fn().mockImplementation(() => {
      return {
        getAdjacentTilesID: jest.fn(),
        getAdjacentTiles: jest.fn(),
        getAdjacentTilesInRange: jest.fn(),
        tileIsAdjacent: jest.fn(),
        getTile: jest.fn(),
        getDistance: jest.fn(),
        getSize: jest.fn(),
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
    mapPresenter = new MapPresenter(presenter) as jest.Mocked<MapPresenter>;
    presenter['_babylonView'] = babylonMainView;
    presenter['gameModel'] = gameCoreModel;
    presenter['_mapPresenter'] = mapPresenter;
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

  describe('getCurrentRound', () => {
    it('should return the current round', () => {
      gameCoreModel.getRound.mockReturnValue(5);
      expect(presenter.getCurrentRound()).toBe(5);
    });
  });
});
