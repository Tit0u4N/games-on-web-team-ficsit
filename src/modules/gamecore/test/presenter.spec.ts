import { GameCorePresenter } from '../presenter/GameCorePresenter.ts';

// Mocking the MainView class
jest.mock('../view/Babylon/BabylonMainView.ts', () => {
  return {
    BabylonMainView: jest.fn().mockImplementation(() => {
      return {
        onSceneReady: jest.fn(),
        onRender: jest.fn(),
      };
    }),
  };
});

describe('GameCorePresenter unit test', () => {
  let presenter: GameCorePresenter;

  beforeEach(() => {
    presenter = new GameCorePresenter();
  });

  it('should be defined', () => {
    expect(presenter).toBeDefined();
  });
});
