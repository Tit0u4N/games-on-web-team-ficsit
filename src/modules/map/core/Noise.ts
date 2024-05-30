// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import * as tumult from 'tumult';

export class Noise {
  private noise: tumult.Simplex1 | tumult.Simplex2 | tumult.Perlin1 | tumult.Perlin2 | tumult.Perlin3;
  private dimension: 1 | 2 | 3;

  constructor(
    seed: number | string = Math.random(),
    dimension: 1 | 2 | 3 = 2,
    noiseType: 'perlin' | 'simplex' = 'perlin',
  ) {
    this.dimension = dimension;

    if (noiseType === 'perlin') {
      if (dimension === 1) this.noise = new tumult.Perlin1(seed);
      else if (dimension === 2) this.noise = new tumult.Perlin2(seed);
      else this.noise = new tumult.Perlin3(seed);
    } else {
      if (dimension === 1) this.noise = new tumult.Simplex1(seed);
      else this.noise = new tumult.Simplex2(seed);
    }
  }

  public get(x: number, y?: number, z?: number): number {
    if (this.dimension === 1) return this.noise.gen(x);
    else if (this.dimension === 2) return this.noise.gen(x, y);
    else if (this.dimension == 3) return this.noise.gen(x, y, z);
    throw new Error('Wrong number of arguments');
  }

  public getSeed(): string {
    return this.noise.seed;
  }
}
