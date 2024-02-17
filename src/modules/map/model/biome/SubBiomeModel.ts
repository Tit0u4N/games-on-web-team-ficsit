import { TypesBiome } from './BiomeAbstractModel.ts';
import { TileModel, TypesTile } from '../TileModel.ts';
import { DirectedVertex } from 'data-structure-typed';
import { MapModel } from '../MapModel.ts';
import { GraphTilesModelGenerator } from '../utils/GraphTilesModelGenerator.ts';
import { GraphTilesModel } from '../GraphTilesModel.ts';

/**
 * This class represents a sub-biome of the map.
 */
export class SubBiomeModel {
  private mapModel: MapModel;
  private type: TypesBiome;
  private tiles: TileModel[] = [];
  private graphTiles: GraphTilesModel;

  private static cpt = 0;
  public id: string;

  constructor(type: TypesBiome, mapTiles: TileModel[], map: MapModel) {
    this.mapModel = map;
    this.type = type;
    this.tiles = mapTiles;
    this.setDefaultTileType();

    const graphGenerator = new GraphTilesModelGenerator(
      map,
      (tile: TileModel) => {
        return tile.typeBiome === this.type;
      },
      this.tiles,
    );
    this.graphTiles = graphGenerator.generateGraphTiles();

    this.parseBiomeByLevel();
  }

  private parseBiomeByLevel(): void {
    const tilesBorder: TileModel[] = this.tiles.filter((tile) => {
      const neighbors: TileModel[] = [];
      this.mapModel.graph.getAdjacentTilesID(tile).forEach((id) => {
        const vertex = this.graphTiles.getVertex(id);
        if (vertex && vertex.value) neighbors.push(vertex.value);
      });
      return neighbors.length < 6;
    });

    tilesBorder.forEach((tile) => {
      tile.type = TypesTile.SNOW;
    });
  }

  private setDefaultTileType(tiles: TileModel[] = this.tiles): void {
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
    tiles.forEach((tile) => (tile.type = type));
  }

  public nbTiles(): number {
    return this.tiles.length;
  }
}
