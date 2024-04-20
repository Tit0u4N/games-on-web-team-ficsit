import {
  ArcRotateCamera,
  Camera,
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
import { ArcRotateCameraKeyboardInputs } from './ArcRotateCameraKeyboardInputs.ts';
import { GameCorePresenter } from '../../presenter/GameCorePresenter.ts';

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
  private _gameCorePresenter: GameCorePresenter;
  private _options: BabylonMainViewOptions;
  private _canvas!: HTMLCanvasElement;
  private _engine!: Engine;
  private _scene!: Scene;
  private _camera!: ArcRotateCamera;
  private _arcRotateCameraKeyboardInputs!: ArcRotateCameraKeyboardInputs;
  private _devCamera!: boolean;

  constructor(gameCorePresenter: GameCorePresenter, devCamera?: boolean, options?: BabylonMainViewOptions) {
    this._gameCorePresenter = gameCorePresenter;
    this._options = { ...DEFAULT_OPTIONS, ...options };
    this._devCamera = devCamera || false;
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

  onSceneReady(): void {
    if (this._devCamera) {
      this.devCamera();
    } else {
      this.gameCamera();
    }
  }

  private gameCamera(): void {
    // This creates and positions a free camera (non-mesh)
    this._camera = new ArcRotateCamera('camera', 0, 0, 10, new Vector3(90, 150, -50), this.scene);

    // The target should also be adjusted so that the camera is looking at the correct location
    this._camera.setTarget(new Vector3(90, 0, 50));

    // This attaches the camera to the canvas
    this._camera.mode = Camera.PERSPECTIVE_CAMERA;
    this._camera.speed = 5;
    this._camera.fov = 0.5;

    const canvas = this.scene.getEngine().getRenderingCanvas();

    // This attaches the camera to the canvas
    this._camera.attachControl(canvas, true);
    this._camera.inputs.clear();
    this._arcRotateCameraKeyboardInputs = new ArcRotateCameraKeyboardInputs(this._camera, this._gameCorePresenter);
    this._camera.inputs.add(this._arcRotateCameraKeyboardInputs);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.5;

    this._arcRotateCameraKeyboardInputs.attachControl(true);
  }

  private devCamera(): void {
    // This creates and positions a free camera (non-mesh)
    const camera = new FreeCamera('camera1', new Vector3(90, 150, -50), this.scene);

    // This targets the camera to scene origin
    camera.setTarget(new Vector3(90, 0, 50));

    const canvas = this.scene.getEngine().getRenderingCanvas();

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
  }

  onRender(): void {
    const resizeWatcher = new ResizeObserver(() => {
      this._engine.resize();
    });
    resizeWatcher.observe(this._canvas);
  }

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

  get camera(): ArcRotateCamera {
    return this._camera;
  }

  get arcRotateCameraKeyboardInputs(): ArcRotateCameraKeyboardInputs {
    return this._arcRotateCameraKeyboardInputs;
  }

  set canvas(value: HTMLCanvasElement) {
    this._canvas = value;
  }
}
