import { IMapModelPresenter, MapModel } from '../model/MapModel.ts';
import { MapView } from '../view/Babylon/MapView.ts';
import { Scene, Vector3 } from '@babylonjs/core';
import { IGraphTiles } from '../model/GraphTilesModel.ts';
import { importModel } from '../../../core/ModelImporter.ts';
import { getPosition, getCharacterPositionOnTile, PositionTypes } from '../core/GamePlacer.ts';
import { ViewInitable } from '../../../core/Interfaces.ts';
import { GameCorePresenter } from '../../gamecore/presenter/GameCorePresenter.ts';

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
export class MapPresenter implements ViewInitable {
  private readonly _mapModel: IMapModelPresenter;
  private _view: MapView;
  private readonly _gameCorePresenter: GameCorePresenter;

  private options: MapPresenterOptions;

  constructor(gameCorePresenter: GameCorePresenter, options: MapPresenterOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this._mapModel = new MapModel(this.options.size!, this.options.seed);
    this._view = new MapView(this._mapModel, this);
    this._gameCorePresenter = gameCorePresenter;
  }
  unMountView(): void {
    throw new Error('Method not implemented.');
  }

  initView(scene: Scene) {
    this._mapModel.init();
    this._view.initView(scene);
    this.testObjects(scene).then();
    this._gameCorePresenter.getCharacters().forEach((character) => {
      this._mapModel
        .getTile(
          this.options.defaultCharacterPosition!.x + (character.id === 3 ? 1 : 0),
          this.options.defaultCharacterPosition!.y,
        )
        .addCharacter(character);
    });
  }

  placeCharacters(initial = false) {
    let counter = 0;
    this._gameCorePresenter.getCharacters().forEach((character) => {
      if (character.tile !== undefined) {
        const position = getCharacterPositionOnTile(
          getPosition(character.tile, PositionTypes.CHARACTER),
          character.tile.getNumberOfCharacters(),
          character.tile.getNumberOfCharacters() > 1 ? counter : 1,
        );
        if (character.tile.getNumberOfCharacters() > 1) counter++;
        if (position !== this._gameCorePresenter.characterPresenter.getCharacterView(character.id)?.mesh?.position)
          this._gameCorePresenter.characterPresenter.characterView.givePosition(character.id, position, initial);
      }
    });
  }

  public getDisplacementGraph(): IGraphTiles {
    return this._mapModel.displacementGraph;
  }

  get gameCorePresenter(): GameCorePresenter {
    return this._gameCorePresenter;
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

  public addDeplacementTiles() {
    const character = this.gameCorePresenter.characterPresenter.getSelectedCharacter();
    if (!character || !character.tile) return;
    const characterTile = character.tile;
    const tileList = this._mapModel.displacementGraph.getAdjacentTilesInRange(
      characterTile,
      character.attributes.movement,
    );
    tileList.forEach((tile) => {
      if (!tile.isWalkable()) return;
      const distance = this._mapModel.displacementGraph.getDistance(characterTile, tile);
      if (distance <= character.attributes.movement) this._view.addDeplacementTile(tile.x, tile.y, tile.type);
    });
  }

  public removeDeplacementTiles() {
    this._view.removeDeplacementTile();
  }

  updateSelectedCharacter() {
    this.removeDeplacementTiles();
    this.addDeplacementTiles();
  }

  unselectCharacter() {
    this._gameCorePresenter.characterPresenter.unselectCharacter();
  }

  moveCharacterToTile(x: number, y: number) {
    const selectedCharacter = this._gameCorePresenter.characterPresenter.getSelectedCharacter();
    if (selectedCharacter) {
      const characterTile = selectedCharacter.tile;
      const tileModel = this._mapModel.getTile(x, y);
      if (!characterTile || !tileModel) return;
      if (!tileModel.isWalkable()) return;
      const distance = this._mapModel.displacementGraph.getDistance(characterTile, tileModel);
      if (distance > selectedCharacter.attributes.movement) return;
      selectedCharacter.tile?.removeCharacter(selectedCharacter);
      console.log(distance);
      selectedCharacter.removeMovementPoints(distance);
      tileModel.addCharacter(selectedCharacter);

      this.removeDeplacementTiles();
      this.unselectCharacter();
      this.placeCharacters();
    }
  }
}
