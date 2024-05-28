import { ActionManager, ExecuteCodeAction, Mesh, Scene, Vector3 } from '@babylonjs/core';
import { ViewInitable } from '@/core/Interfaces.ts';
import { TrainingCenterModel } from '@building/model/TrainingCenterModel.ts';
import { TrainingCenterPresenter } from '@building/presenter/TrainingCenterPresenter.ts';
import { importModel } from '@core/ModelImporter.ts';

export class TrainingCenterView implements ViewInitable {
  private trainingCenterModel: TrainingCenterModel;
  private scene!: Scene;
  private _mesh!: Mesh;
  private trainingCenterPresenter: TrainingCenterPresenter;
  private static readonly SCALE = 0.01;

  constructor(arenaPresenter: TrainingCenterPresenter) {
    this.trainingCenterPresenter = arenaPresenter;
    this.trainingCenterModel = this.trainingCenterPresenter.trainingCenter;
  }

  async initView(scene: Scene) {
    this.scene = scene;
    await this.createMesh(this.trainingCenterModel.position);
    this.addActionManager();
    this.trainingCenterModel.initialize();
  }

  // Create a cube above the tile
  public async createMesh(vector: Vector3) {
    const importedModel = await importModel('scene.glb', {
      scene: this.scene,
      path: 'trainingCenter/',
      multiMaterial: true,
    });
    const mesh = importedModel.mesh;
    if (!mesh) throw new Error('Mesh not found');
    mesh.scaling = new Vector3(TrainingCenterView.SCALE, TrainingCenterView.SCALE, TrainingCenterView.SCALE);
    mesh.position = vector.add(new Vector3(0, 0.1, 0));
    this._mesh = mesh;
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
