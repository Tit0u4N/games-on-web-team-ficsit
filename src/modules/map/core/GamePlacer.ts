import { TileView } from '../view/Babylon/TileView.ts';
import { Vector3 } from '@babylonjs/core';
import { TypesTile } from '../model/TileModel.ts';
import { TileViewFactory } from '../view/Babylon/TileViewFactory.ts';

export enum PositionTypes {
  PAWN,
  BUILDING,
  DECORATION,
}
export function getPosition(obj: { x: number; y: number; type: TypesTile }, positionTypes: PositionTypes) {
  const modifierX = 1;
  const modifierY = 1.41;
  const height = TileViewFactory.getHeight(obj.type) / 2;
  const deltaXPosition =
    positionTypes === PositionTypes.DECORATION ? 0 : positionTypes === PositionTypes.PAWN ? -1 : 0.7;
  if (obj.x % 2 === 0) {
    return new Vector3(
      obj.x * (TileView.radius + modifierX) + deltaXPosition,
      height,
      obj.y * (TileView.radius + modifierY),
    );
  } else {
    return new Vector3(
      obj.x * (TileView.radius + modifierX) + deltaXPosition,
      height,
      obj.y * (TileView.radius + modifierY) + TileView.radius - 0.27,
    );
  }
}

export function getTilePosition(vector: Vector3, nbPawn: number, noPawn: number) {
  switch (nbPawn) {
    case 2:
      if (noPawn === 0) return vector.add(new Vector3(0, 0, 0.5));
      return vector.add(new Vector3(0, 0, -0.5));
    case 3:
      if (noPawn === 0) return vector.add(new Vector3(-0.35, 0, 0));
      if (noPawn === 1) return vector.add(new Vector3(0.15, 0, 0.8));
      return vector.add(new Vector3(0.15, 0, -0.8));
    default:
      return vector;
  }
}
