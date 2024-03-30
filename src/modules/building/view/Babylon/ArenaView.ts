import { Color4, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from '@babylonjs/core';
import { ArenaModel } from '../../model/ArenaModel.ts';
import { ViewInitable } from '../../../../core/Interfaces.ts';
import { ArenaPresenter } from '../../presenter/ArenaPresenter.ts';

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
  }

  // Create a cube above the tile
  public createMesh(vector: Vector3): void {
    // add red color
    const cube = MeshBuilder.CreateBox(
      'cube_tile',
      {
        size: 2,
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
    cube.position = vector.add(new Vector3(0, 5, 0));
    cube.material = new StandardMaterial('material_cube', this.scene);
    this._mesh = cube;
  }

  get mesh(): Mesh {
    return this._mesh;
  }
}
