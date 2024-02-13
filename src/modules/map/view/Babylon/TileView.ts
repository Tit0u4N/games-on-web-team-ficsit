import { Color3, InstancedMesh, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from '@babylonjs/core';
import { TypesTile } from '../../model/TileModel.ts';

/**
 * Tile class for the game
 * Contains a mesh and a position
 */
export class TileView {
  private scene: Scene;
  private _mesh: InstancedMesh;
  private type: TypesTile;
  private static radius: number = 2;

  constructor(scene: Scene, x: number, y: number, baseTile: BaseTile) {
    this.scene = scene;
    this._mesh = this.createHexagonMesh(x, y, baseTile);
    this.type = baseTile.type;
  }

  private createHexagonMesh(x: number, y: number, baseTile: BaseTile): InstancedMesh {
    const mesh = baseTile.baseMesh.createInstance('tileInstance_' + x + '_' + y);

    const modifierX = 1;
    const modifierY = 1.41;

    if (x % 2 === 0) {
      mesh.position = new Vector3(x * (TileView.radius + modifierX), 0, y * (TileView.radius + modifierY));
    } else {
      mesh.position = new Vector3(
        x * (TileView.radius + modifierX),
        0,
        y * (TileView.radius + modifierY) + TileView.radius - 0.27,
      );
    }

    return mesh;
  }

  get mesh(): InstancedMesh {
    return this._mesh;
  }
}
