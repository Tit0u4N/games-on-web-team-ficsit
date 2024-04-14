import { DicePresenter } from '../presenter/DicePresenter.ts';
//Mock Dice3D
jest.mock('../view/Babylon/Dice3D.ts', () => {
  return {
    Dice3D: jest.fn().mockImplementation(() => {
      return {
        delete: jest.fn(),
      };
    }),
  };
});

describe('Building model', () => {
  let presenter: DicePresenter;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    presenter = new DicePresenter(null);
  });

  it('should be defined', () => {
    expect(presenter).toBeDefined();
  });
});
