import { MapModel } from '../../model/MapModel.ts';
import { TileModel } from '../../model/TileModel.ts';
import { DirectedGraph } from 'data-structure-typed';
import { TilePresenter } from '../TilePresenter.ts';
import { MapPresenter } from '../MapPresenter.ts';
import { GraphTilesGeneratorAbstract } from '../../core/GraphTilesGeneratorAbstract.ts';

export class GraphTilesPresenterGenerator extends GraphTilesGeneratorAbstract {
  private readonly _mapPresenter: MapPresenter;
  constructor(
    mapModel: MapModel,
    mapPresenter: MapPresenter,
    tileConditionFunc?: (tile: TileModel) => boolean,
    segmentTiles?: TileModel[],
  ) {
    super(mapModel, tileConditionFunc, segmentTiles);
    this._mapPresenter = mapPresenter;
  }

  /**
   * Generate the graph of the valid tiles by the condition function
   * @returns DirectedGraph<TileModel>
   */
  public generateGraphTiles(): DirectedGraph<TilePresenter> {
    const graph = new DirectedGraph<TilePresenter>();
    const tileValidateForGraph: TileModel[] = this.getTilesValidateForGraph();

    // Create vertices (TilePresenter)
    for (const tile of tileValidateForGraph) {
      graph.addVertex(TilePresenter.getIDFromTileModel(tile), new TilePresenter(tile, this._mapPresenter));
    }

    // Create edges (use the ID of the TilePresenter from the TileModel ID)
    for (let i = 0; i < tileValidateForGraph.length; i++) {
      const tile = tileValidateForGraph[i];
      const adjacentTiles = this.getAdjacentTiles(tile);
      const tileIDSource = TilePresenter.getIDFromTileModel(tile);
      for (const tileAdjacent of adjacentTiles) {
        graph.addEdge(tileIDSource, TilePresenter.getIDFromTileModel(tileAdjacent));
      }
    }

    return graph;
  }
}
