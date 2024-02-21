import { GameCorePresenter } from '../presenter/Presenter.ts';

// Mocking the MainView class
jest.mock('../view/React/MainView.tsx', () => {
  return {
    MainView: jest.fn().mockImplementation(() => {
      return {
        startGame: jest.fn(),
        startNewGame: jest.fn(),
        init: jest.fn(),
        notifyViewChange: jest.fn(),
      };
    }),
  };
});

describe('Building model', () => {
  let presenter: GameCorePresenter;

  beforeEach(() => {
    presenter = new GameCorePresenter();
  });

  it('should be defined', () => {
    expect(presenter).toBeDefined();
  });
});
