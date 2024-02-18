import { TileModel, TypesTile } from '../../model/TileModel.ts';
import { TypesBiome } from '../../model/biome/BiomeAbstractModel.ts';

describe('TileModel', () => {
  let tileModel: TileModel;
  beforeEach(() => {
    tileModel = new TileModel(0, 0, 0.5);
  });

  describe('constructor', () => {
    it('should create a new instance of TileModel', () => {
      expect(tileModel).toBeDefined();

      expect(tileModel['_x']).toBe(0);
      expect(tileModel['_y']).toBe(0);
      expect(tileModel['noiseValue']).toBe(0.5);
      expect(tileModel['_typeBiome']).toBe(TypesBiome.PLAIN);
      expect(tileModel['_type']).toBe(TypesTile.GRASS);
    });
  });

  describe('getTypeByBiome', () => {
    it('should return the type of the tile by the type of the biome', () => {
      expect(tileModel['getTypeByBiome']()).toBe(TypesTile.GRASS);
    });
  });

  describe('addHill', () => {
    it('should add a hill to the tile', () => {
      tileModel['_type'] = TypesTile.GRASS;
      tileModel.addHill();
      expect(tileModel['_type']).toBe(TypesTile.HILL_GRASS);
    });

    it('should add a hill to the tile', () => {
      tileModel['_type'] = TypesTile.SAND;
      tileModel.addHill();
      expect(tileModel['_type']).toBe(TypesTile.HILL_SAND);
    });

    it('should add a hill to the tile', () => {
      tileModel['_type'] = TypesTile.FOREST;
      tileModel.addHill();
      expect(tileModel['_type']).toBe(TypesTile.HILL_FOREST);
    });
  });

  describe('addForest', () => {
    it('should add a forest to the tile', () => {
      tileModel['_type'] = TypesTile.GRASS;
      tileModel.addForest();
      expect(tileModel['_type']).toBe(TypesTile.FOREST);
    });

    it('should add a forest to the tile', () => {
      tileModel['_type'] = TypesTile.HILL_GRASS;
      tileModel.addForest();
      expect(tileModel['_type']).toBe(TypesTile.HILL_FOREST);
    });
  });

  describe('getID', () => {
    it('should return the ID of the tile for the graph', () => {
      expect(tileModel.getID()).toBe('0_0');
    });
  });
});
