import { Scene } from '@babylonjs/core';

export interface ViewInitable {
  initView(scene: Scene): void;
  unMountView(): void;
}

export interface Reactable {
  getReactView(): {
    type: React.ElementType;
    props: object;
  };
}
