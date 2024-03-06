import { UsableObject } from '../model/UsableObject.ts';

describe('Building model', () => {
  let model: UsableObject;

  beforeEach(() => {
    model = new UsableObject('vite.svg', 'vite.svg');
  });

  it('should be defined', () => {
    expect(model).toBeDefined();
  });
});
