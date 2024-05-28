import { TypesBiome } from './BiomeAbstractModel.ts';
import { TileModel, TypesTile } from '@map/model/TileModel.ts';
import { MapModel } from '@map/model/MapModel.ts';
import { GraphTilesModelGenerator } from '@map/model/utils/GraphTilesModelGenerator.ts';
import { GraphTilesModel } from '@map/model/GraphTilesModel.ts';

/**
 * This class represents a sub-biome of the map.
 */
export class SubBiomeModel {
  private type: TypesBiome;
  private tiles: TileModel[] = [];
  private graphTiles: GraphTilesModel;
  private _id: string = '';

  constructor(type: TypesBiome, mapTiles: TileModel[], map: MapModel) {
    this.type = type;
    this.tiles = mapTiles;
    this.setSubBiomeToTiles();

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

  private setSubBiomeToTiles(tiles: TileModel[] = this.tiles): void {
    tiles.forEach((tile) => {
      tile.subBiome = this;
    });
  }

  setTilesType(tiles: TileModel[], type: TypesTile): void {
    tiles.forEach((tile) => {
      tile.type = type;
    });
  }

  get id(): string {
    return this._id;
  }
}
