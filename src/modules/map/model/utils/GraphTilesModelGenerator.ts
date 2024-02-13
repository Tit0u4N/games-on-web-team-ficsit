import { MapModel } from '../MapModel.ts';
import { DirectedGraph } from 'data-structure-typed';
import { TileModel } from '../TileModel.ts';
import { GraphTilesGeneratorAbstract } from '../../core/GraphTilesGeneratorAbstract.ts';

export class GraphTilesModelGenerator extends GraphTilesGeneratorAbstract {
  constructor(mapModel: MapModel, tileConditionFunc?: (tile: TileModel) => boolean, segmentTiles?: TileModel[]) {
    super(mapModel, tileConditionFunc, segmentTiles);
  }

  /**
   * Generate the graph of the valid tiles by the condition function
   * @returns DirectedGraph<TileModel>
   */
  public generateGraphTiles(): DirectedGraph<TileModel> {
    const graph = new DirectedGraph<TileModel>();
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
        graph.addEdge(tileIDSource, tileAdjacent.getID());
      }
    }

    return graph;
  }
}
