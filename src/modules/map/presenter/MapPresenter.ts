import { IMapModelPresenter, MapModel } from '../model/MapModel.ts';
import { MapView } from '../view/Babylon/MapView.ts';
import { Scene, Vector3 } from '@babylonjs/core';
import { IGraphTiles } from '../model/GraphTilesModel.ts';
import { importModel } from '../../../core/ModelImporter.ts';
import { getPosition, getCharacterPositionOnTile, PositionTypes } from '../core/GamePlacer.ts';
import { GameCorePresenter } from '../../gamecore/presenter/GameCorePresenter.ts';
import { ITile } from '../model/TileModel.ts';

type MapPresenterOptions = {
  size?: number;
  seed?: number | string;
  defaultCharacterPosition?: { x: number; y: number };
};

const DEFAULT_OPTIONS: Readonly<MapPresenterOptions> = Object.freeze({
  size: 100,
  seed: Math.random(),
  defaultCharacterPosition: { x: 12, y: 25 },
});
export class MapPresenter {
  private _mapModel: IMapModelPresenter;
  private _view: MapView;
  private gameCorePresenter: GameCorePresenter;

  private options: MapPresenterOptions;

  constructor(gameCorePresenter: GameCorePresenter, options: MapPresenterOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this._mapModel = new MapModel(this.options.size!, this.options.seed);
    this._view = new MapView(this._mapModel);
    this.gameCorePresenter = gameCorePresenter;
  }

  init(scene: Scene) {
    this._mapModel.init();
    this._view.init(scene);
    this.testObjects(scene).then();
    this.gameCorePresenter.getCharacters().forEach((character) => {
      this._mapModel
        .getTile(
          this.options.defaultCharacterPosition!.x + (character.id === 3 ? 1 : 0),
          this.options.defaultCharacterPosition!.y,
        )
        .addCharacter(character);
    });
  }

  placeCharacters() {
    let previousTile: ITile;
    let counter = 0;
    this.gameCorePresenter.getCharacters().forEach((character) => {
      if (character.tile !== undefined) {
        previousTile === character.tile ? counter++ : (counter = 0);
        previousTile = character.tile;
        const position = getCharacterPositionOnTile(
          getPosition(character.tile, PositionTypes.CHARACTER),
          character.tile.getNumberOfCharacters(),
          counter,
        );
        this.gameCorePresenter.characterPresenter.characterView.givePosition(character.id, position);
      }
    });
  }

  public getDisplacementGraph(): IGraphTiles {
    return this._mapModel.displacementGraph;
  }

  private async testObjects(scene: Scene) {
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
