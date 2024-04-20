import { MapModel } from '../../model/MapModel.ts';

jest.mock('../../model/utils/GraphTilesModelGenerator.ts', () => {
  const mockGraphTilesModel = jest.fn().mockImplementation(() => {});
  return {
    GraphTilesModelGenerator: jest.fn().mockImplementation(() => {
      return {
        generateGraphTiles: jest.fn().mockReturnValue(new mockGraphTilesModel()),
      };
    }),
  };
});

jest.mock('../../model/utils/GraphTilesModelGenerator.ts', () => {
  const mockGraphTilesModel = jest.fn().mockImplementation(() => {
    return {
      setGraphSize: jest.fn(), // Add this line
    };
  });
  return {
    GraphTilesModelGenerator: jest.fn().mockImplementation(() => {
      return {
        generateGraphTiles: jest.fn().mockReturnValue(new mockGraphTilesModel()),
      };
    }),
  };
});

jest.mock('../../model/biome/BiomeFactoryModel.ts', () => {
  const mockBiomeMountainModel = jest.fn().mockImplementation(() => {});
  const originalModule = jest.requireActual('../../model/biome/BiomeFactoryModel.ts');
  return {
    ...originalModule,
    createBiome: jest.fn().mockReturnValue(new mockBiomeMountainModel()),
  };
});

jest.mock('../../model/NoiseMap.ts', () => {
  return {
    NoiseMap: jest.fn().mockImplementation(() => {
      return {
        get: jest.fn().mockReturnValue(0.5),
      };
    }),
  };
});

describe('Map model', () => {
  let mapModel: MapModel;

  beforeEach(() => {
    mapModel = new MapModel(10, 10);
    mapModel.init();
  });

  describe('constructor', () => {
    it('should create a new instance of MapModel', () => {
      expect(mapModel).toBeDefined();
    });

    it('should create a new instance of MapModel with the correct size', () => {
      expect(mapModel['_size']).toBe(10);
    });

    it('should create a new instance of MapModel with the correct seed', () => {
      expect(mapModel['_seed']).toBe(10);

      mapModel = new MapModel(10);
      expect(mapModel['_seed']).toBeDefined();
    });
  });

  describe('generate', () => {
    it('should generate the base map', () => {
      expect(mapModel['_tiles']).toBeDefined();
      expect(mapModel['_tiles'].length).toBe(10);
      expect(mapModel['_tiles'][0].length).toBe(10);
      expect(mapModel['_tiles'].flat().length).toBe(100);

      // Test if all the tiles are defined
      expect(mapModel['_tiles'].flat().every((tile) => tile !== undefined)).toBe(true);
    });

    it('should generate the graph of the tiles', () => {
      expect(mapModel['_graph']).toBeDefined();
    });

    it('should generate the biomes', () => {
      expect(mapModel['_biomes']).toBeDefined();
      expect(mapModel['_biomes'].length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getTile', () => {
    it('should return the tiles', () => {
      for (let x = 0; x < mapModel.size; x++) {
        for (let y = 0; y < mapModel.size; y++) {
          expect(mapModel.getTile(x, y)).toBe(mapModel['_tiles'][x][y]);
        }
      }
    });

    it('should throw error', () => {
      expect(() => mapModel.getTile(10, 10)).toThrow();
      expect(() => mapModel.getTile(-1, -1)).toThrow();
      expect(() => mapModel.getTile(0, 10)).toThrow();
      expect(() => mapModel.getTile(10, 0)).toThrow();
      expect(() => mapModel.getTile(-5, 0)).toThrow();
      expect(() => mapModel.getTile(0, -5)).toThrow();
    });
  });
});
