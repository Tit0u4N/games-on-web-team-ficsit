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
import { ViewInitable } from '../../../../core/Interfaces.ts';
import { TrainingCenterModel } from '../../model/TrainingCenterModel.ts';
import { TrainingCenterPresenter } from '../../presenter/TrainingCenterPresenter.ts';

export class TrainingCenterView implements ViewInitable {
  private trainingCenterModel: TrainingCenterModel;
  private scene!: Scene;
  private _mesh!: Mesh;
  private trainingCenterPresenter: TrainingCenterPresenter;

  constructor(arenaPresenter: TrainingCenterPresenter) {
    this.trainingCenterPresenter = arenaPresenter;
    this.trainingCenterModel = this.trainingCenterPresenter.trainingCenter;
  }

  initView(scene: Scene) {
    this.scene = scene;
    this.createMesh(this.trainingCenterModel.position);
    this.addActionManager();
    this.trainingCenterModel.initialize();
  }

  // Create a cube above the tile
  public createMesh(vector: Vector3): void {
    // add red color
    const cube = MeshBuilder.CreateBox(
      'cube_tile',
      {
        size: 1,
        faceColors: [
          new Color4(0, 0, 1, 1),
          new Color4(0, 0, 1, 1),
          new Color4(0, 0, 1, 1),
          new Color4(0, 0, 1, 1),
          new Color4(0, 0, 1, 1),
          new Color4(0, 0, 1, 1),
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
          this.trainingCenterPresenter.openModal();
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
