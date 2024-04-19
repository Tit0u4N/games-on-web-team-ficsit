import { ActionManager, Color3, ExecuteCodeAction, Mesh, PBRMaterial, Scene, Vector3 } from '@babylonjs/core';
import { importModel } from '../../../../core/ModelImporter.ts';
import { CharacterView } from './CharacterView.ts';

export class PawnView {
  protected static readonly DEFAULT_SCALING = 0.2;
  protected static readonly SELECTED_SCALING = 0.3;

  private readonly _characterView: CharacterView;
  private _mesh: Mesh | undefined;
  private readonly _id: number;
  private readonly _scene: Scene;
  private readonly _color: string;
  private _isSelected: boolean = false;

  async importMesh(): Promise<void> {
    const mesh = await importModel('scene.gltf', { scene: this._scene });
    if (!mesh) throw new Error('Mesh not found');
    mesh.scaling = new Vector3(PawnView.DEFAULT_SCALING, PawnView.DEFAULT_SCALING, PawnView.DEFAULT_SCALING);
    mesh.rotation = new Vector3(0, -Math.PI / 2, 0);
    (mesh.material as PBRMaterial).albedoColor = Color3.FromHexString(this._color);
    mesh.actionManager = new ActionManager(this._scene);
    this._mesh = mesh;
  }

  constructor(id: number, scene: Scene, color: string = '#ff0000', characterView: CharacterView) {
    this._id = id;
    this._scene = scene;
    this._color = color;
    this._characterView = characterView;
  }

  addPointerEvent(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const pawn = this;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this._mesh.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickTrigger, function () {
        if (!pawn.mesh) return;
        if (!pawn.isSelected) {
          pawn.mesh.scaling = new Vector3(
            PawnView.SELECTED_SCALING,
            PawnView.SELECTED_SCALING,
            PawnView.SELECTED_SCALING,
          );
          pawn.isSelected = true;
          pawn._characterView.unscaleCharacters(pawn.id);
          pawn._characterView.updateSelectedCharacter();
        } else {
          pawn.mesh.scaling = new Vector3(PawnView.DEFAULT_SCALING, PawnView.DEFAULT_SCALING, PawnView.DEFAULT_SCALING);
          pawn.isSelected = false;
          pawn._characterView.updateSelectedCharacter();
        }
      }),
    );
  }

  get mesh(): Mesh | undefined {
    return this._mesh;
  }

  get id(): number {
    return this._id;
  }

  get isSelected(): boolean {
    return this._isSelected;
  }

  set isSelected(value: boolean) {
    this._isSelected = value;
  }

  resetScaling() {
    if (this._mesh) {
      this._mesh.scaling = new Vector3(PawnView.DEFAULT_SCALING, PawnView.DEFAULT_SCALING, PawnView.DEFAULT_SCALING);
    }
  }
}