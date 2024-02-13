import { TypesBiome } from './BiomeAbstractModel.ts';
import { TileModel, TypesTile } from '../TileModel.ts';
import { DirectedGraph, DirectedVertex } from 'data-structure-typed';
import { MapModel } from '../MapModel.ts';
import { GraphTilesModelGenerator } from '../utils/GraphTilesModelGenerator.ts';

/**
 * This class represents a sub-biome of the map.
 */
export class SubBiomeModel {
  private type: TypesBiome;
  private tiles: TileModel[] = [];
  private graphTiles: DirectedGraph<TileModel>;

  private static cpt = 0;
  public id: string;

  constructor(type: TypesBiome, mapTiles: TileModel[], map: MapModel) {
    this.type = type;
    this.validateMapTiles(mapTiles);
    this.tiles = this.extractBiomeTiles(mapTiles);
    this.setDefaultTileType();

    const graphGenerator = new GraphTilesModelGenerator(
      map,
      (tile: TileModel) => {
        return tile.typeBiome === this.type;
      },
      this.tiles,
    );
    this.graphTiles = graphGenerator.generateGraphTiles();

    // this.parseBiomeByLevel()
  }

  private validateMapTiles(mapTiles: TileModel[]): void {
    if (mapTiles.length === 0) {
      throw new Error('Tiles array is empty');
    }
  }

  private extractBiomeTiles(mapTiles: TileModel[]): TileModel[] {
    const indexTilesToRemove: number[] = [];
    const extractedTiles: TileModel[] = [];
    mapTiles.forEach((tile, index) => {
      if (this.isBiomeTile(tile, extractedTiles)) {
        extractedTiles.push(tile);
        tile.subBiome = this;
        indexTilesToRemove.push(index);
      }
    });

    indexTilesToRemove.reverse().forEach((index) => mapTiles.splice(index, 1));
    return extractedTiles;
  }

  private parseBiomeByLevel(): void {
    const tilesIDAndUsed = this.tiles.map((tile, index) => {
      return {
        index,
        id: tile.getID(),
        isUsed: false,
      };
    });

    const tilesBorder = [];
    for (let i = 0; i < tilesIDAndUsed.length; i++) {
      if (this.graphTiles.getNeighbors(tilesIDAndUsed[i].id).length < 6) {
        tilesBorder.push(tilesIDAndUsed[i]);
      }
    }

    tilesBorder.forEach((tile) => {
      const tileModel = this.graphTiles.get(tile.id);
      if (tileModel) {
        tileModel.type = TypesTile.SNOW;
      }
    });
  }

  private isBiomeTile(tile: TileModel, extractedTiles: TileModel[]): boolean {
    return tile.typeBiome === this.type && this.isTileAdjacentToBiome(tile, extractedTiles);
  }

  private isTileAdjacentToBiome(tileToCheck: TileModel, extractedTiles: TileModel[]): boolean {
    if (extractedTiles.length === 0) {
      return true;
    }
    for (const tile of extractedTiles) {
      if (tileToCheck.isAdjacentToTile(tile)) {
        return true;
      }
    }
    return false;
  }

  private setDefaultTileType(): void {
    let type = TypesTile.DEFAULT;
    if (SubBiomeModel.cpt % 9 === 0) {
      type = TypesTile.DEFAULT;
    } else if (SubBiomeModel.cpt % 8 === 0) {
      type = TypesTile.DEFAULT2;
    } else if (SubBiomeModel.cpt % 7 === 0) {
      type = TypesTile.DEFAULT3;
    } else if (SubBiomeModel.cpt % 6 === 0) {
      type = TypesTile.DEFAULT4;
    } else if (SubBiomeModel.cpt % 5 === 0) {
      type = TypesTile.DEFAULT5;
    } else if (SubBiomeModel.cpt % 4 === 0) {
      type = TypesTile.DEFAULT6;
    } else if (SubBiomeModel.cpt % 3 === 0) {
      type = TypesTile.DEFAULT7;
    } else if (SubBiomeModel.cpt % 2 === 0) {
      type = TypesTile.DEFAULT8;
    } else {
      type = TypesTile.DEFAULT9;
    }
    this.id = 'Biome_' + SubBiomeModel.cpt;
    SubBiomeModel.cpt++;
    this.tiles.forEach((tile) => (tile.type = type));
  }

  public nbTiles(): number {
    return this.tiles.length;
  }

  getNeighbors(tile: TileModel): DirectedVertex<TileModel>[] {
    return this.graphTiles.getNeighbors(tile.getID());
  }
}
