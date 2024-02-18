import { TypesBiome } from './BiomeAbstractModel.ts';
import { TileModel, TypesTile } from '../TileModel.ts';
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
  private _id: string = '';

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

    this.parseBiomeByLevel(this.tiles, this.graphTiles);
  }

  private parseBiomeByLevel(tiles: TileModel[], graph: GraphTilesModel): void {
    let tilesBorder: TileModel[] = this.getBorderTiles(tiles, graph);
    let tilesInside: TileModel[] = this.getInsideTiles(tiles, tilesBorder);

    this.setTilesType(tilesInside, TypesTile.SNOW);
    this.setTilesType(tilesBorder, TypesTile.MOUNTAIN);
  }

  getBorderTiles(tiles: TileModel[], graph: GraphTilesModel): TileModel[] {
    return tiles.filter((tile) => {
      const neighbors: TileModel[] = [];
      graph.getAdjacentTilesID(tile).forEach((id) => {
        const vertex = this.graphTiles.getVertex(id);
        if (vertex && vertex.value) neighbors.push(vertex.value);
      });
      return neighbors.length < 6;
    });
  }

  getInsideTiles(tiles: TileModel[], tilesBorder: TileModel[]): TileModel[] {
    return tiles.filter((tile) => {
      return !tilesBorder.includes(tile);
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
    this.id = SubBiomeModel.cpt;
    SubBiomeModel.cpt++;
    tiles.forEach((tile) => {
      tile.type = type;
      tile.subBiome = this;
    });
  }

  setTilesType(tiles: TileModel[], type: TypesTile): void {
    tiles.forEach((tile) => {
      tile.type = type;
    });
  }

  public nbTiles(): number {
    console.log(this._id);
    return this.tiles.length;
  }

  get id(): string {
    return this._id;
  }

  set id(value: number) {
    this._id = 'Biome_' + value;
  }
}
