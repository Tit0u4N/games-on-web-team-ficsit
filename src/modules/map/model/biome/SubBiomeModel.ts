import {TypesBiome} from './BiomeAbstractModel.ts';
import {TileModel, TypesTile} from '../TileModel.ts';
import {DirectedGraph, DirectedVertex, VertexKey} from 'data-structure-typed';
import {MapModel} from '../MapModel.ts';
import {GraphTilesModelGenerator} from '../utils/GraphTilesModelGenerator.ts';
import {CoupleTileIndex, SubBiomeTilesIdentifier} from "./SubBiomeTilesIdentifier.ts";

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

    this.parseBiomeByLevel()
    }

  private parseBiomeByLevel(): void {
    const tilesBorder: TileModel[] = this.tiles.filter((tile) => {
        const neighbors: TileModel[] = []
        tile.getAdjacentTilesID().forEach((id) => {
          const vertex = this.graphTiles.getVertex(id)
          if (vertex && vertex.value) neighbors.push(vertex.value)
        })
        return neighbors.length < 6;
    })

    tilesBorder.forEach(tile => {
      tile.type = TypesTile.SNOW;
    })
  }

  private setDefaultTileType(tiles : TileModel[] = this.tiles): void {
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

  getNeighbors(tile: TileModel): DirectedVertex<TileModel>[] {
    return this.graphTiles.getNeighbors(tile.getID());
  }
}
