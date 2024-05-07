import {
  ActionManager,
  Color4,
  ExecuteCodeAction,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core';
import { ArenaModel } from '@building/model/ArenaModel.ts';
import { ViewInitable } from '@/core/Interfaces.ts';
import { ArenaPresenter } from '@building/presenter/ArenaPresenter.ts';

export class ArenaView implements ViewInitable {
  private arenaModel: ArenaModel;
  private scene!: Scene;
  private _mesh!: Mesh;
  private arenaPresenter: ArenaPresenter;

  constructor(arenaPresenter: ArenaPresenter) {
    this.arenaPresenter = arenaPresenter;
    this.arenaModel = this.arenaPresenter.arena;
  }

  initView(scene: Scene) {
    this.scene = scene;
    this.createMesh(this.arenaModel.position);
    this.addActionManager();
  }

  // Create a cube above the tile
  public createMesh(vector: Vector3): void {
    // add red color
    const cube = MeshBuilder.CreateBox(
      'cube_tile',
      {
        size: 1,
        faceColors: [
          new Color4(1, 0, 0, 1),
          new Color4(1, 0, 0, 1),
          new Color4(1, 0, 0, 1),
          new Color4(1, 0, 0, 1),
          new Color4(1, 0, 0, 1),
          new Color4(1, 0, 0, 1),
        ],
      },
      this.scene,
    );
    cube.position = vector.add(new Vector3(0, 0, 0));
    cube.material = new StandardMaterial('material_cube', this.scene);
    this._mesh = cube;
  }

  private addActionManager(): void {
    // Add onclick listener
    this._mesh.actionManager = new ActionManager(this.scene);
    this._mesh.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnPickTrigger,
        },
        () => {
          this.arenaPresenter.openModal();
        },
      ),
    );
  }

  get mesh(): Mesh {
    return this._mesh;
  }

  unMountView(): void {
    this._mesh.dispose();
  }
}
