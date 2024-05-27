import { Character } from '../model/Character.ts';
import { Attributes } from '../model/Attributes.ts';
import { Country } from '../../../core/Country.tsx';

jest.mock('../../../core/Country.tsx', () => {
  return {
    Country: {
      getRandom: jest.fn().mockReturnValue('random_country'),
    },
  };
});

describe('Building model', () => {
  let model: Character;

  beforeEach(() => {
    model = new Character(0, 'no_manes', Country.getRandom(), 0, new Attributes(0, 0, false), '/no_image.png');
  });

  it('should be defined', () => {
    expect(model).toBeDefined();
  });
});
