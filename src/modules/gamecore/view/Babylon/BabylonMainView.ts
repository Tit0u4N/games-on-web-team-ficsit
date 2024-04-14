import {
  Engine,
  EngineOptions,
  FreeCamera,
  HavokPlugin,
  HemisphericLight,
  Scene,
  SceneOptions,
  Vector3,
} from '@babylonjs/core';
import HavokPhysics from '@babylonjs/havok';

type BabylonMainViewOptions = {
  antialias: boolean;
  engineOptions: EngineOptions;
  adaptToDeviceRatio: boolean;
  sceneOptions: SceneOptions;
};

const DEFAULT_OPTIONS: Readonly<BabylonMainViewOptions> = {
  antialias: true,
  engineOptions: {},
  adaptToDeviceRatio: true,
  sceneOptions: {},
};

export class BabylonMainView {
  private _options: BabylonMainViewOptions;
  private _canvas!: HTMLCanvasElement;
  private _engine!: Engine;
  private _scene!: Scene;

  constructor(options?: BabylonMainViewOptions) {
    this._options = { ...DEFAULT_OPTIONS, ...options };
  }

  async init(canvas: HTMLCanvasElement): Promise<void> {
    this._canvas = canvas;
    if (!this._canvas) throw new Error('Canvas not found');
    this._engine = new Engine(
      this._canvas,
      this._options.antialias,
      this._options.engineOptions,
      this._options.adaptToDeviceRatio,
    );
    this._scene = new Scene(this._engine, this._options.sceneOptions);
    const havokPlugin = new HavokPlugin(true, await HavokPhysics());
    this._scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin);
  }

  onSceneReady() {
    // This creates and positions a free camera (non-mesh)
    const camera = new FreeCamera('camera1', new Vector3(60, 30, -10), this.scene);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    const canvas = this.scene.getEngine().getRenderingCanvas();

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
  }

  onRender(): void {}

  get engine(): Engine {
    return this._engine;
  }

  set engine(value: Engine) {
    this._engine = value;
  }

  set scene(value: Scene) {
    this._scene = value;
  }

  get scene(): Scene {
    return this._scene;
  }

  set canvas(value: HTMLCanvasElement) {
    this._canvas = value;
  }
}
