import { MapModel } from '@map/model/MapModel.ts';
import { Noise } from '@map/core/Noise.ts';
import { BiomeAbstractModel, TypesBiome } from './BiomeAbstractModel.ts';

export class BiomePlainModel extends BiomeAbstractModel {
  constructor(map: MapModel) {
    super(TypesBiome.PLAIN, map);

    this.addHills();
    this.addForests();
  }

  public addHills(): void {
    const seed = this.baseSeed + '-hills';
    const noise = new Noise(seed, 2);
    const sizeMod = 4;

    const octaveFunc = (noiseValue: number) => {
      return Math.sin(1 / noiseValue);
    };

    for (const tile of this.tiles) {
      const n = octaveFunc(noise.get(tile.x / sizeMod, tile.y / sizeMod));
      if (n > 0.5) {
        tile.addHill();
      }
    }
  }

  addForests(): void {
    const seed = this.baseSeed + '-forests';
    const noise = new Noise(seed, 2);
    const sizeMod = 4;

    for (const tile of this.tiles) {
      const n = Math.sin(1 / noise.get(tile.x / sizeMod, tile.y / sizeMod));
      if (n > 0.4) {
        tile.addForest();
      }
    }
  }
}
