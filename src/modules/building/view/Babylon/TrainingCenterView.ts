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
    // Add onclick listener
    cube.actionManager = new ActionManager(this.scene);
    cube.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnPickTrigger,
        },
        () => {
          console.log('Training Center was clicked');
          // Add your code here to handle the click event
        },
      ),
    );
    this._mesh = cube;
  }

  get mesh(): Mesh {
    return this._mesh;
  }

  unMountView(): void {
    this._mesh.dispose();
  }
}
