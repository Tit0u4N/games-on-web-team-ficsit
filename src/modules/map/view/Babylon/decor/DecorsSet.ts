import { Scene, Vector3 } from '@babylonjs/core';
import { Decor, DecorMeshOptions, IDecor } from './Decor.ts';
import { ImportModelOptions } from '@/core/ModelImporter.ts';

export type GlobalOptions = {
  importOptions?: ImportModelOptions;
  meshOptions?: DecorMeshOptions;
};

export class DecorsSet implements IDecor {
  private decors: IDecor[] = [];
  private allDecorsToMount: Vector3[] = [];
  private _meshOptions: DecorMeshOptions;
  private _importOptions: ImportModelOptions;

  constructor(globalOptions: GlobalOptions = {}) {
    this._meshOptions = globalOptions.meshOptions || {};
    this._importOptions = globalOptions.importOptions || {};
  }

  /**
   * Add a decor to the set, with global options
   * @param decor - decor to add
   * @param options - options to apply to the decor (mesh, import) default is {mesh : false, import : true}
   */
  addDecor(decor: IDecor, options: { mesh: boolean; import: boolean } = { mesh: false, import: true }) {
    if (options.mesh) {
      decor.meshOptions = this._meshOptions;
    }
    if (options.import) {
      decor.importOptions = this._importOptions;
    }
    this.decors.push(decor);
  }

  async initView(scene: Scene) {
    for (const decor of this.decors) {
      await decor.initView(scene);
    }
  }

  getRandomDecor(): IDecor {
    if (this.decors.length === 1) return this.decors[0];
    return this.decors[Math.floor(Math.random() * this.decors.length)];
  }

  unMountView() {
    if (this.decors.length > 0) {
      this.decors.forEach((decor) => decor.unMountView());
    }
  }

  addDecorToMount(position: Vector3) {
    this.getRandomDecor().addDecorToMount(position);
    this.allDecorsToMount.push(position);
  }

  distanceToNearestDecor(position: Vector3): number {
    return this.allDecorsToMount.reduce((minDistance, decorPosition) => {
      const distance = Vector3.Distance(position, decorPosition);
      return distance < minDistance ? distance : minDistance;
    }, Number.MAX_VALUE);
  }

  set importOptions(value: ImportModelOptions) {
    this._importOptions = value;
  }

  set meshOptions(value: DecorMeshOptions) {
    this._meshOptions = value;
  }

  static createTreesSet(): DecorsSet {
    const treesDecors = new DecorsSet({
      importOptions: {
        multiMaterial: true,
        path: 'trees/',
      },
    });

    treesDecors.addDecor(
      new Decor('trees1.gltf', {
        meshOptions: {
          scale: 1.5,
        },
      }),
    );

    treesDecors.addDecor(
      new Decor('trees1.gltf', {
        meshOptions: {
          scale: new Vector3(1.5, 2, 1.5),
          rotation: new Vector3(0, Math.PI / 3, 0),
        },
      }),
    );

    treesDecors.addDecor(
      new Decor('trees1.gltf', {
        meshOptions: {
          scale: new Vector3(1.3, 1.5, 1.3),
          rotation: new Vector3(0, Math.PI / 2, 0),
        },
      }),
    );

    treesDecors.addDecor(
      new Decor('trees2.gltf', {
        meshOptions: {
          scale: 1.5,
        },
      }),
    );

    treesDecors.addDecor(
      new Decor('trees2.gltf', {
        meshOptions: {
          scale: new Vector3(1.5, 2, 1.5),
          rotation: new Vector3(0, Math.PI / 3, 0),
        },
      }),
    );

    treesDecors.addDecor(
      new Decor('trees2.gltf', {
        meshOptions: {
          scale: new Vector3(1.3, 1.5, 1.3),
          rotation: new Vector3(0, Math.PI / 5, 0),
        },
      }),
    );

    treesDecors.addDecor(
      new Decor('trees3.gltf', {
        meshOptions: {
          scale: 1.3,
        },
      }),
    );

    treesDecors.addDecor(
      new Decor('trees3.gltf', {
        meshOptions: {
          scale: new Vector3(1.5, 2, 1.5),
          rotation: new Vector3(0, Math.PI / 3, 0),
        },
      }),
    );

    treesDecors.addDecor(
      new Decor('trees3.gltf', {
        meshOptions: {
          scale: new Vector3(1.3, 1.5, 1.3),
          rotation: new Vector3(0, Math.PI / 3, 0),
        },
      }),
    );

    return treesDecors;
  }

  static createRocksSet(): DecorsSet {
    const rocksDecors = new DecorsSet({
      importOptions: {
        path: 'rocks/',
      },
    });

    rocksDecors.addDecor(
      new Decor('rock1.gltf', {
        meshOptions: {
          scale: 0.2,
        },
      }),
    );

    rocksDecors.addDecor(
      new Decor('rock1.gltf', {
        meshOptions: {
          scale: 0.2,
          rotation: new Vector3(0, Math.PI / 3, 0),
        },
      }),
    );

    rocksDecors.addDecor(
      new Decor('rock1.gltf', {
        meshOptions: {
          scale: 0.2,
          rotation: new Vector3(0, Math.PI / 3, Math.PI / 3),
        },
      }),
    );

    return rocksDecors;
  }
}
