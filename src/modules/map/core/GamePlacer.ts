import { TileView } from '@map/view/Babylon/TileView.ts';
import { Vector3 } from '@babylonjs/core';
import { TypesTile } from '@map/model/TileModel.ts';
import { TileViewFactory } from '@map/view/Babylon/TileViewFactory.ts';

export enum PositionTypes {
  CHARACTER,
  BUILDING,
  DECORATION,
  TILE,
}
export function getPosition(obj: { x: number; y: number; type: TypesTile }, positionType: PositionTypes) {
  const modifierX = 1;
  const modifierY = 1.41;

  let height = TileViewFactory.getHeight(obj.type);
  if (positionType === PositionTypes.TILE) height = height / 2;

  let deltaXPosition = 0;
  if (positionType === PositionTypes.CHARACTER) deltaXPosition = -1;
  if (positionType === PositionTypes.BUILDING) deltaXPosition = 0.7;

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

export function getCharacterPositionOnTile(tileVector: Vector3, nbCharacter: number, noCharacter: number) {
  switch (nbCharacter) {
    case 2:
      if (noCharacter === 0) return tileVector.add(new Vector3(0, 0, 0.5));
      return tileVector.add(new Vector3(0, 0, -0.5));
    case 3:
      if (noCharacter === 0) return tileVector.add(new Vector3(-0.35, 0, 0));
      if (noCharacter === 1) return tileVector.add(new Vector3(0.15, 0, 0.8));
      return tileVector.add(new Vector3(0.15, 0, -0.8));
    default:
      return tileVector;
  }
}
