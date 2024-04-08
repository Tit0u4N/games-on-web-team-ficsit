import { IMapModelPresenter, MapModel } from '../model/MapModel.ts';
import { MapView } from '../view/Babylon/MapView.ts';
import { Color3, PBRMaterial, Scene, Vector3 } from '@babylonjs/core';
import { IGraphTiles } from '../model/GraphTilesModel.ts';
import { importModel } from '../../../core/ModelImporter.ts';
import { getPosition, getCharacterPositionOnTile, PositionTypes } from '../core/GamePlacer.ts';
import { ViewInitable } from '../../../core/Interfaces.ts';

type MapPresenterOptions = {
  size?: number;
  seed?: number | string;
};

const DEFAULT_OPTIONS: Readonly<MapPresenterOptions> = Object.freeze({
  size: 100,
  seed: Math.random(),
});
export class MapPresenter implements ViewInitable {
  private _mapModel: IMapModelPresenter;
  private _view: MapView;

  private options: MapPresenterOptions;

  constructor(options: MapPresenterOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this._mapModel = new MapModel(this.options.size!, this.options.seed);
    this._view = new MapView(this._mapModel);
    this._mapModel.init();
  }

  unMountView(): void {
    throw new Error('Method not implemented.');
  }

  initView(scene: Scene) {
    this._view.initView(scene);
    this.testObjects(scene).then();
  }

  public getDisplacementGraph(): IGraphTiles {
    return this._mapModel.displacementGraph;
  }

  private async testObjects(scene: Scene) {
    const mesh = await importModel('scene.gltf', { scene });
    mesh.position = getCharacterPositionOnTile(
      getPosition(this._mapModel.getTile(12, 25), PositionTypes.CHARACTER),
      2,
      0,
    );
    mesh.scaling = new Vector3(0.2, 0.2, 0.2);
    mesh.rotation = new Vector3(0, -Math.PI / 2, 0);
    (mesh.material as PBRMaterial).albedoColor = Color3.FromHexString('#ff0000');
    const meshCopy = await importModel('scene.gltf', { scene });
    meshCopy.position = getCharacterPositionOnTile(
      getPosition(this._mapModel.getTile(12, 25), PositionTypes.CHARACTER),
      2,
      1,
    );
    meshCopy.scaling = new Vector3(0.2, 0.2, 0.2);
    meshCopy.rotation = new Vector3(0, -Math.PI / 2, 0);
    (meshCopy.material as PBRMaterial).albedoColor = Color3.FromHexString('#00ff00');
    const meshCopy2 = await importModel('scene.gltf', { scene });
    meshCopy2.position = getCharacterPositionOnTile(
      getPosition(this._mapModel.getTile(12, 26), PositionTypes.CHARACTER),
      1,
      0,
    );
    meshCopy2.scaling = new Vector3(0.2, 0.2, 0.2);
    meshCopy2.rotation = new Vector3(0, -Math.PI / 2, 0);
    (meshCopy2.material as PBRMaterial).albedoColor = Color3.FromHexString('#0000ff');
    const mesh3 = await importModel('trees2.gltf', { scene, multiMaterial: true });
    mesh3.position = getPosition(this._mapModel.getTile(12, 24), PositionTypes.DECORATION).add(new Vector3(0, -0.3, 0));
    mesh3.scaling = new Vector3(1.2, 1.2, 1.2);
    mesh3.rotation = new Vector3(0, 0, 0);
    const mesh2 = await importModel('trees.gltf', { scene, multiMaterial: true });
    mesh2.position = getPosition(this._mapModel.getTile(12, 25), PositionTypes.BUILDING);
    mesh2.scaling = new Vector3(0.7, 0.7, 0.7);
    mesh2.rotation = new Vector3(0, Math.PI / 4, 0);
  }
}
