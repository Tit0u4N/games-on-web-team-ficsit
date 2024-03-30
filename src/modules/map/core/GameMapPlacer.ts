import { TileView } from '../view/Babylon/TileView.ts';
import { Vector3 } from '@babylonjs/core';

export function getPosition(x: number, y: number) {
  const modifierX = 1;
  const modifierY = 1.41;
  if (x % 2 === 0) {
    return new Vector3(x * (TileView.radius + modifierX), 0, y * (TileView.radius + modifierY));
  } else {
    return new Vector3(
      x * (TileView.radius + modifierX),
      0,
      y * (TileView.radius + modifierY) + TileView.radius - 0.27,
    );
  }
}
