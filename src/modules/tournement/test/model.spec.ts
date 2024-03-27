import { Tournament } from '../model/Tournament.ts';

describe('Building model', () => {
  let tournament: Tournament;

  beforeEach(() => {
    tournament = new Tournament();
  });

  it('should be defined', () => {
    expect(tournament).toBeDefined();
  });
});
