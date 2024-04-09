import { Color3, Mesh, PBRMaterial, Scene, Vector3 } from '@babylonjs/core';
import { importModel } from '../../../../core/ModelImporter.ts';

export class PawnView {
  private _mesh: Mesh | undefined;
  private readonly _id: number;
  private readonly _scene: Scene;
  private readonly _color: string;

  async importMesh(): Promise<void> {
    const mesh = await importModel('scene.gltf', { scene: this._scene });
    mesh.scaling = new Vector3(0.2, 0.2, 0.2);
    mesh.rotation = new Vector3(0, -Math.PI / 2, 0);
    (mesh.material as PBRMaterial).albedoColor = Color3.FromHexString(this._color);
    this._mesh = mesh;
  }

  constructor(id: number, scene: Scene, color: string = '#ff0000') {
    this._id = id;
    this._scene = scene;
    this._color = color;
  }

  get mesh(): Mesh | undefined {
    return this._mesh;
  }

  get id(): number {
    return this._id;
  }
}
