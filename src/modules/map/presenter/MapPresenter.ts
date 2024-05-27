import { IMapModelPresenter, MapModel } from '@map/model/MapModel.ts';
import { MapView } from '@map/view/Babylon/MapView.ts';
import { Scene } from '@babylonjs/core';
import { IGraphTiles } from '@map/model/GraphTilesModel.ts';
import { getPosition, getCharacterPositionOnTile, PositionTypes } from '@map/core/GamePlacer.ts';
import { config, ViewInitable } from '@/core/Interfaces.ts';
import { GameCorePresenter } from '@gamecore/presenter/GameCorePresenter.ts';

type MapPresenterOptions = {
  size?: number;
  seed?: number | string;
};

const DEFAULT_OPTIONS: Readonly<MapPresenterOptions> = Object.freeze({
  size: config.map.view.mapPresenter.defaultOptions.size,
  seed: Math.random(),
});

export class MapPresenter implements ViewInitable {
  private _mapModel!: IMapModelPresenter;
  private _view!: MapView;
  private readonly _gameCorePresenter: GameCorePresenter;

  private options: MapPresenterOptions;

  constructor(gameCorePresenter: GameCorePresenter, options: MapPresenterOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this._gameCorePresenter = gameCorePresenter;
  }

  unMountView(): void {
    throw new Error('Method not implemented.');
  }

  initView(scene: Scene) {
    // if the size of the map is not the same as teh config, update it
    if (config.map.view.mapPresenter.defaultOptions.size !== this.options.size)
      this.options.size = config.map.view.mapPresenter.defaultOptions.size;
    if (config.map.view.mapPresenter.defaultOptions.seed !== null)
      this.options.seed = config.map.view.mapPresenter.defaultOptions.seed;
    this._mapModel = new MapModel(this.options.size!, this.options.seed);
    this._view = new MapView(this._mapModel, this);
    this._mapModel.init();
    this._view.initView(scene);

    // Calculate the center of the map
    const centerX = Math.floor(this._mapModel.tiles[0].length / 2);
    const centerY = Math.floor(this._mapModel.tiles.length / 3);

    // Initialize the search radius and the current tile
    let radius = 1;
    let tile = null;

    // Search for a walkable tile in a circular radius around the center
    while (radius <= Math.max(centerX, centerY) && !tile) {
      for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
          if (x * x + y * y > radius * radius) {
            continue; // Skip the points outside the circle
          }

          // Calculate the tile index and check if it's walkable
          const tileX = centerX + x;
          const tileY = centerY + y;
          if (
            tileX >= 0 &&
            tileX < this._mapModel.tiles[0].length &&
            tileY >= 0 &&
            tileY < this._mapModel.tiles.length &&
            this._mapModel.getTile(tileX, tileY).isWalkable()
          ) {
            tile = this._mapModel.getTile(tileX, tileY);
            break;
          }
        }
        if (tile) {
          break; // Stop the search if a walkable tile is found
        }
      }
      radius++; // Increase the search radius
    }

    // Add the characters to the walkable tile
    if (tile) {
      this._gameCorePresenter.getCharacters().forEach((character) => {
        tile.addCharacter(character);
      });
    } else {
      console.error('No walkable tile found on the map!');
    }
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
        this._gameCorePresenter.checkCharacterInBuilding(character);
      }
    });
  }

  public getDisplacementGraph(): IGraphTiles {
    return this._mapModel.displacementGraph;
  }

  get gameCorePresenter(): GameCorePresenter {
    return this._gameCorePresenter;
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
      selectedCharacter.removeMovementPoints(distance);
      tileModel.addCharacter(selectedCharacter);

      this.removeDeplacementTiles();
      this.unselectCharacter();
      this.placeCharacters();
    }
  }

  get view(): MapView {
    return this._view;
  }
}
