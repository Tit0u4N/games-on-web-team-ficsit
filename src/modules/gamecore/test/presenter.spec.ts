import { GameCorePresenter } from '../presenter/Presenter.ts';

// Mocking the MainView class
jest.mock('../view/Babylon/View.ts', () => {
  return {
    BabylonView: jest.fn().mockImplementation(() => {
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
