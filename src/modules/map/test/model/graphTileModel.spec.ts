import { GraphTilesModel } from '../../model/GraphTilesModel.ts';
import { TileModel } from '../../model/TileModel.ts';
import { mockTileModel } from '../__mocks__/model.ts';

describe('GraphTileModel', () => {
  let graphTileModel: GraphTilesModel;
  let tiles: TileModel[][];

  beforeAll(() => {
    tiles = [
      [mockTileModel('0_0'), mockTileModel('0_1')],
      [mockTileModel('1_0'), mockTileModel('1_1')],
    ];

    graphTileModel = new GraphTilesModel();

    for (let tile of tiles.flat()) {
      graphTileModel.addVertex(tile.getID(), tile);
    }

    graphTileModel.addEdge('0_0', '0_1');
    graphTileModel.addEdge('0_0', '1_0');

    graphTileModel.addEdge('0_1', '0_0');
    graphTileModel.addEdge('0_1', '1_1');

    graphTileModel.addEdge('1_0', '0_0');
    graphTileModel.addEdge('1_0', '1_1');

    graphTileModel.addEdge('1_1', '0_1');
    graphTileModel.addEdge('1_1', '1_0');
  });

  describe('constructor', () => {
    it('should create a new instance of GraphTileModel', () => {
      const graphTileModel = new GraphTilesModel();
      expect(graphTileModel).toBeDefined();
    });
  });

  describe('getAdjacentTilesID', () => {
    it('should return the adjacent tiles id', () => {
      const adjacentTiles = graphTileModel.getAdjacentTilesID(mockTileModel('0_0'));
      expect(adjacentTiles).toEqual(['0_1', '1_0']);

      const adjacentTiles2 = graphTileModel.getAdjacentTilesID(mockTileModel('0_1'));
      expect(adjacentTiles2).toEqual(['0_0', '1_1']);
    });
  });

  describe('getAdjacentTiles', () => {
    it('should return the adjacent tiles', () => {
      const adjacentTiles = graphTileModel.getAdjacentTiles(mockTileModel('0_0'));
      expect(adjacentTiles.map((tile) => tile.getID())).toEqual(['0_1', '1_0']);

      const adjacentTiles2 = graphTileModel.getAdjacentTiles(mockTileModel('0_1'));
      expect(adjacentTiles2.map((tile) => tile.getID())).toEqual(['0_0', '1_1']);
    });
  });

  describe('tileIsAdjacent', () => {
    it('should return true if the tiles are adjacent', () => {
      const tile1 = mockTileModel('0_0');
      const tile2 = mockTileModel('0_1');
      expect(graphTileModel.tileIsAdjacent(tile1, tile2)).toBe(true);
    });

    it('should return false if the tiles are not adjacent', () => {
      const tile1 = mockTileModel('0_0');
      const tile2 = mockTileModel('1_1');
      expect(graphTileModel.tileIsAdjacent(tile1, tile2)).toBe(false);
    });
  });
});
