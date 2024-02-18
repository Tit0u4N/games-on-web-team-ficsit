import { Noise } from '../core/Noise.ts';

export class NoiseMap extends Noise {
  private widthMap: number;
  private heightMap: number;

  constructor(widthMap: number, heightMap?: number, seed?: number | string) {
    super(seed || Math.random(), 3, 'perlin', 8);
    this.widthMap = widthMap;
    this.heightMap = heightMap || widthMap;
  }

  public get(x: number, y: number): number {
    const noiseModifier: number = 0.4;
    const noiseScale: number = 0.05;

    let noiseVal = super.get((x / noiseModifier) * noiseScale, (y / noiseModifier) * noiseScale, 3);
    let dist = Math.sqrt(Math.pow(x - 1 - this.widthMap / 2, 2) + Math.pow(y - 1 - this.heightMap / 2, 2));
    let grad = dist / (0.5 * Math.max(this.widthMap, this.heightMap));

    noiseVal += Math.pow(grad, 2);
    // noiseVal = Math.max(noiseVal, 0)

    return noiseVal;
  }
  /*
def __init__(self, size=(50, 50), color_range=10, color_perlin_scale=0.025, scale=350, octaves=6, persistance=0.6,
                 lacunarity=2.0, x_starting_pos=0, y_starting_pos=0):

  self.heightMap[i][j] = noise.pnoise3(
  new_i / self.scale,
  new_j / self.scale,
  random_nr,
  octaves=self.octaves,
    persistence=self.persistance,
    lacunarity=self.lacunarity,
    repeatx=10000000,
    repeaty=10000000, base=0)
*/
}
