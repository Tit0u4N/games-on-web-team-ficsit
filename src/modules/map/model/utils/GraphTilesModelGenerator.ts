import { MapModel } from '../MapModel.ts';
import { TileModel, TypesTile } from '../TileModel.ts';
import { GraphTilesGeneratorAbstract } from '../../core/GraphTilesGeneratorAbstract.ts';
import { GraphTilesModel } from '../GraphTilesModel.ts';

export class GraphTilesModelGenerator extends GraphTilesGeneratorAbstract {
  constructor(mapModel: MapModel, tileConditionFunc?: (tile: TileModel) => boolean, segmentTiles?: TileModel[]) {
    super(mapModel, tileConditionFunc, segmentTiles);
  }

  /**
   * Generate the graph of the valid tiles by the condition function
   * @returns GraphTilesModel
   */
  public generateGraphTiles(): GraphTilesModel {
    const graph = new GraphTilesModel();
    const tileValidateForGraph: TileModel[] = this.getTilesValidateForGraph();

    //Create vertices
    for (const tile of tileValidateForGraph) {
      graph.addVertex(tile.getID(), tile);
    }

    // Create edges
    for (let i = 0; i < tileValidateForGraph.length; i++) {
      const tile = tileValidateForGraph[i];
      const adjacentTiles = this.getAdjacentTiles(tile);
      const tileIDSource = tile.getID();
      for (const tileAdjacent of adjacentTiles) {
        graph.addEdge(tileIDSource, tileAdjacent.getID(), tileAdjacent.type === TypesTile.FOREST ? 3 : 1);
      }
    }

    return graph;
  }
}
