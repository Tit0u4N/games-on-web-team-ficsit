import { Character } from '../model/Character.ts';
import { Attributes } from '../model/Attributes.ts';

describe('Building model', () => {
  let model: Character;

  beforeEach(() => {
    model = new Character(0, 'no_manes', 'NULL', 0, new Attributes(0, 0, false), '/no_image.png');
  });

  it('should be defined', () => {
    expect(model).toBeDefined();
  });
});
