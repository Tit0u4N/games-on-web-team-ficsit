import { Matrix, Mesh, Scene, Vector3 } from '@babylonjs/core';
import { ViewInitable } from '@/core/Interfaces.ts';
import { importModel, ImportModelOptions } from '@/core/ModelImporter.ts';
import { GameOptions } from '@/core/GameOptions.ts';

export type DecorMeshOptions = {
  scale?: Vector3 | number;
  position?: Vector3;
  rotation?: Vector3;
};

export type DecorOptions = {
  meshLoader?: (scene: Scene) => Mesh;
  importOptions?: ImportModelOptions;
  meshOptions?: DecorMeshOptions;
};

export interface IDecor extends ViewInitable {
  addDecorToMount(position: Vector3): void;
  distanceToNearestDecor(position: Vector3): number;
  set meshOptions(value: DecorMeshOptions);
  set importOptions(value: ImportModelOptions);
}

export class Decor implements IDecor {
  private fileName: string;
  private mesh!: Mesh;
  private decorToMount: Vector3[] = [];

  private _meshOptions: DecorMeshOptions;
  private _importOptions: ImportModelOptions;
  private meshLoader?: (scene: Scene) => Mesh;

  constructor(fileName: string, options: DecorOptions = {}) {
    this.fileName = fileName;
    this._meshOptions = options.meshOptions || {};
    this._importOptions = options.importOptions || {};
    this.meshLoader = options.meshLoader;
  }

  // public methods

  async initView(scene: Scene) {
    await this.loadMesh(scene);
    this.applyOptions();
    this.createParentOfMesh(scene);

    for (const position of this.decorToMount) {
      this.mesh.thinInstanceAdd(Matrix.Translation(position.x, position.y, position.z));
    }
  }

  unMountView() {
    if (this.mesh) {
      this.mesh.dispose();
    }
  }

  addDecorToMount(position: Vector3) {
    this.decorToMount.push(position);
  }

  distanceToNearestDecor(position: Vector3): number {
    return this.decorToMount.reduce((minDistance, decorPosition) => {
      const distance = Vector3.Distance(position, decorPosition);
      return distance < minDistance ? distance : minDistance;
    }, Number.MAX_VALUE);
  }

  set meshOptions(value: DecorMeshOptions) {
    this._meshOptions = value;
  }
  set importOptions(value: ImportModelOptions) {
    this._importOptions = value;
  }

  // private methods

  private async loadMesh(scene: Scene) {
    if (this.meshLoader) {
      this.mesh = this.meshLoader(scene);
    } else {
      const options = { ...this._importOptions, scene: scene };
      this.mesh = await importModel(this.fileName, options);
    }
    this.mesh.receiveShadows = GameOptions.instance.shadows;
  }

  private applyOptions() {
    if (!this.mesh) throw new Error('Mesh not loaded');
    if (GameOptions.instance.shadows) this.mesh.receiveShadows = true;
    this.applyScale();
    this.applyPosition();
    this.applyRotation();
  }

  private applyScale() {
    if (!this._meshOptions.scale) return;
    let scale: Vector3;
    if (typeof this._meshOptions.scale === 'number') {
      scale = new Vector3(this._meshOptions.scale, this._meshOptions.scale, this._meshOptions.scale);
    } else {
      scale = this._meshOptions.scale;
    }
    this.mesh.scaling = scale;
  }

  private applyPosition() {
    if (!this._meshOptions.position) return;
    this.decorToMount.forEach((position) => {
      position.addInPlace(this._meshOptions.position!);
    });
  }

  private applyRotation() {
    if (!this._meshOptions.rotation) return;
    this.mesh.rotation = this._meshOptions.rotation;
  }

  private createParentOfMesh(scene: Scene) {
    this.mesh = Mesh.MergeMeshes([this.mesh], true, false, undefined, false, true) as Mesh;
  }
}
