import { Matrix, Mesh, Scene, Vector3 } from '@babylonjs/core';
import { ViewInitable } from '../../../../core/Interfaces.ts';
import { importModel, ImportModelOptions } from '../../../../core/ModelImporter.ts';

export class Decor implements ViewInitable {
  private optionsImporter: ImportModelOptions;
  private modelsPath: string[];
  private baseMeshes: Mesh[] = [];
  private baseMeshesOptions: Array<(mesh: Mesh) => void> = [];

  private decorToMount: Vector3[] = [];
  private static allDecor: Vector3[] = [];

  constructor(modelsPath: string[], optionsImporter: ImportModelOptions = {}) {
    const defaultOptionsImporter = { multiMaterial: true };
    this.modelsPath = modelsPath;
    this.optionsImporter = { ...defaultOptionsImporter, ...optionsImporter };
    return this;
  }

  async initView(scene: Scene) {
    this.optionsImporter.scene = scene;
    await this.loadModels();
    for (const position of this.decorToMount) {
      this.getRandomBaseMesh().thinInstanceAdd(Matrix.Translation(position.x, position.y, position.z));
    }
  }

  async loadModels() {
    for (const modelPath of this.modelsPath) {
      const baseMesh = await importModel(modelPath, this.optionsImporter);
      this.baseMeshesOptions.forEach((options) => options(baseMesh));
      this.baseMeshes.push(baseMesh);
    }
  }

  getRandomBaseMesh() {
    if (this.baseMeshes.length === 1) return this.baseMeshes[0];
    return this.baseMeshes[Math.floor(Math.random() * this.baseMeshes.length)];
  }

  unMountView() {
    if (this.baseMeshes.length > 0) {
      this.baseMeshes.forEach((baseMesh) => baseMesh.dispose());
    }
  }

  addDecor(position: Vector3) {
    this.decorToMount.push(position);
    Decor.allDecor.push(position);
  }

  distanceToNearestDecor(position: Vector3): number {
    return this.decorToMount.reduce((minDistance, decorPosition) => {
      const distance = Vector3.Distance(position, decorPosition);
      return distance < minDistance ? distance : minDistance;
    }, Number.MAX_VALUE);
  }

  addMeshesOptions(options: (mesh: Mesh) => void) {
    this.baseMeshesOptions.push(options);
  }
}
