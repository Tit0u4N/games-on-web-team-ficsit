import { Arena } from '../model/ArenaModel.ts';
import { Tournament } from '../../tournement/model/Tournament.ts';
import { SportType } from '../../sport/model/Sport.ts';
import { Vector3 } from '@babylonjs/core';

describe('Building model', () => {
  let arena: Arena;

  beforeEach(() => {
    arena = new Arena(
      [SportType.ATHLETISM],
      new Vector3(0, 0, 0),
      'Arena name',
      new Tournament(),
    );
  });

  it('should be defined', () => {
    expect(arena).toBeDefined();
  });
});
