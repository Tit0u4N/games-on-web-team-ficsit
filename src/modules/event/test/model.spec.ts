import { EventModel } from '../model/EventModel.ts';

describe('Building model', () => {
  let model: EventModel;

  beforeEach(() => {
    model = new EventModel(1, 'test');
  });

  it('should be defined', () => {
    expect(model).toBeDefined();
  });
});
