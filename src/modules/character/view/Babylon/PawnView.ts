import { Color3, Mesh, PBRMaterial, PointerEventTypes, Scene, Vector3 } from '@babylonjs/core';
import { importModel } from '../../../../core/ModelImporter.ts';

export class PawnView {
  private static readonly DEFAULT_SCALING = 0.2;
  private static readonly SELECTED_SCALING = 0.3;

  private _mesh: Mesh | undefined;
  private readonly _id: number;
  private readonly _scene: Scene;
  private readonly _color: string;
  private isSelected: boolean = false;

  async importMesh(): Promise<void> {
    const mesh = await importModel('scene.gltf', { scene: this._scene });
    if (!mesh) throw new Error('Mesh not found');
    mesh.scaling = new Vector3(PawnView.DEFAULT_SCALING, PawnView.DEFAULT_SCALING, PawnView.DEFAULT_SCALING);
    mesh.rotation = new Vector3(0, -Math.PI / 2, 0);
    (mesh.material as PBRMaterial).albedoColor = Color3.FromHexString(this._color);
    this._mesh = mesh;
  }

  constructor(id: number, scene: Scene, color: string = '#ff0000') {
    this._id = id;
    this._scene = scene;
    this._color = color;
  }

  addPointerEvent(): void {
    this._scene.onPointerObservable.add((pointerInfo) => {
      if (!this._mesh) return;
      if (
        !this.isSelected &&
        pointerInfo.type === PointerEventTypes.POINTERPICK &&
        pointerInfo.pickInfo?.pickedMesh === this._mesh
      ) {
        this._mesh.scaling = new Vector3(
          PawnView.SELECTED_SCALING,
          PawnView.SELECTED_SCALING,
          PawnView.SELECTED_SCALING,
        );
        this.isSelected = true;
      } else if (
        pointerInfo.type === PointerEventTypes.POINTERPICK &&
        pointerInfo.pickInfo?.pickedMesh !== this._mesh
      ) {
        this._mesh.scaling = new Vector3(PawnView.DEFAULT_SCALING, PawnView.DEFAULT_SCALING, PawnView.DEFAULT_SCALING);
        this.isSelected = false;
      }
    });
  }

  get mesh(): Mesh | undefined {
    return this._mesh;
  }

  get id(): number {
    return this._id;
  }
}
