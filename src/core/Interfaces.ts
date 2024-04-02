import { Scene } from '@babylonjs/core';

export interface ViewInitable {
  initView(scene: Scene): void;
}
