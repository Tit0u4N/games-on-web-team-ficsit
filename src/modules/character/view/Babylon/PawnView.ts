import {
  ActionManager,
  AnimationGroup,
  ExecuteCodeAction,
  Mesh,
  MeshBuilder,
  Scene,
  SceneLoader,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core';
import { CharacterView } from './CharacterView';
import { config } from '@core/Interfaces';

export class PawnView {
  protected static readonly DEFAULT_SCALING = config.character.view.babylon.pawnView.defaultScaling;
  protected static readonly SELECTED_SCALING = config.character.view.babylon.pawnView.selectedScaling;

  private readonly _characterView: CharacterView;
  private _mesh!: Mesh;
  private readonly _id: number;
  private readonly _scene: Scene;
  private _isSelected: boolean = false;
  private _animations: AnimationGroup[] = [];

  constructor(id: number, scene: Scene, characterView: CharacterView) {
    this._id = id;
    this._scene = scene;
    this._characterView = characterView;
  }

  async importMesh(fileName: string, path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      SceneLoader.ImportMesh(
        '',
        './models/' + path,
        fileName,
        this._scene,
        (meshes, particleSystems, skeletons, animationGroups) => {
          if (!meshes || meshes.length === 0) {
            reject(new Error('Mesh not found'));
            return;
          }
          const root = meshes[0];
          const outer = MeshBuilder.CreateBox('outer', { width: 0.55, depth: 0.55, height: 3.7 }, this._scene);
          outer.isVisible = true;
          outer.isPickable = true;
          const material = new StandardMaterial('outerMaterial', this._scene);
          material.alpha = 0;
          outer.material = material;
          //body is our actual player mesh
          const body = root;

          body.parent = outer;
          body.isPickable = true; //so our raycasts dont hit ourself
          body.getChildMeshes().forEach((m) => {
            m.isPickable = false;
          });

          const mesh = outer as Mesh;
          this._animations = animationGroups;

          mesh.scaling = new Vector3(PawnView.DEFAULT_SCALING, PawnView.DEFAULT_SCALING, PawnView.DEFAULT_SCALING);

          mesh.isPickable = true; // Ensure the mesh is pickable
          mesh.actionManager = new ActionManager(this._scene);

          this._mesh = mesh;

          this.stopAnimations();

          resolve();
        },
        null,
        (scene, message, exception) => {
          reject(exception);
        },
      );
    });
  }

  addPointerEvent(): void {
    const pawn = this;
    this._mesh.actionManager!.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickTrigger, function () {
        console.log('click');
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

  get mesh(): Mesh {
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

  startAnimations(): void {
    this._animations[16]?.start(true); // Ensure the animation exists and then play it
  }

  stopAnimations(): void {
    for (const anim of this._animations) {
      anim.stop();
    }
  }
}
