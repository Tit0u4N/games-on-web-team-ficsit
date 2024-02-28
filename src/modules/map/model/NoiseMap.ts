import { Noise } from '../core/Noise.ts';

export class NoiseMap extends Noise {
  private widthMap: number;
  private heightMap: number;

  constructor(widthMap: number, heightMap?: number, seed?: number | string) {
    super(seed || Math.random(), 3, 'perlin');
    this.widthMap = widthMap;
    this.heightMap = heightMap || widthMap;
  }

  public get(x: number, y: number): number {
    const noiseModifier: number = 0.4;
    const noiseScale: number = 0.05;

    let noiseVal = super.get((x / noiseModifier) * noiseScale, (y / noiseModifier) * noiseScale, 0);
    let dist = Math.sqrt(Math.pow(x - 1 - this.widthMap / 2, 2) + Math.pow(y - 1 - this.heightMap / 2, 2));
    let grad = dist / (0.5 * Math.max(this.widthMap, this.heightMap));

    noiseVal += Math.pow(grad, 2);

    return noiseVal;
  }
}
