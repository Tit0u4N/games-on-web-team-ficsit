import { GameCoreModel } from '../model/GameCoreModel.ts';
import { GameModel } from '../model/GameModel.ts';

jest.mock('../model/GameModel.ts', () => {
  return {
    GameModel: jest.fn().mockImplementation(() => {
      return {
        playRound: jest.fn(),
        getRound: jest.fn(),
      };
    }),
  };
});

describe('Building model', () => {
  let model: GameCoreModel;
  let gameModel: jest.Mocked<GameModel>;

  beforeEach(() => {
    model = new GameCoreModel();
    gameModel = new GameModel() as jest.Mocked<GameModel>;
    model['currentGame'] = gameModel;
  });

  it('should be defined', () => {
    expect(model).toBeDefined();
    expect(gameModel).toBeDefined();
  });

  describe('createNewGame', () => {
    it('should create a new game', () => {
      model.createNewGame();
      expect(model['currentGame']).toBeDefined();
    });
  });

  describe('playRound', () => {
    it('should play a round', () => {
      gameModel.getRound.mockReturnValue(1);
      model.playRound();
      expect(model.getRound()).toBe(1);
    });
  });

  describe('getRound', () => {
    it('should return the current round', () => {
      gameModel.getRound.mockReturnValueOnce(0);
      expect(model.getRound()).toBe(0);
      gameModel.getRound.mockReturnValueOnce(5);
      expect(model.getRound()).toBe(5);
    });
  });
});
