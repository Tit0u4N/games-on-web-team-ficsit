import { Character } from '../model/Character.ts';
import { Attributes } from '../model/Attributes.ts';

describe('Building model', () => {
  let model: Character;

  beforeEach(() => {
    model = new Character(0, '0', '0', 0, new Attributes(0, 0, false));
  });

  it('should be defined', () => {
    expect(model).toBeDefined();
  });
});
