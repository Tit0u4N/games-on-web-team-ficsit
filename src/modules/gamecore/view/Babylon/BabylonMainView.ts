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
import { config } from '../../../../core/Interfaces.ts';

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
  private readonly _gameCorePresenter: GameCorePresenter;
  private _options: BabylonMainViewOptions;
  private _canvas!: HTMLCanvasElement;
  private _engine!: Engine;
  private _scene!: Scene;
  private _camera!: ArcRotateCamera;
  private _arcRotateCameraKeyboardInputs!: ArcRotateCameraKeyboardInputs;

  constructor(gameCorePresenter: GameCorePresenter, options?: BabylonMainViewOptions) {
    this._gameCorePresenter = gameCorePresenter;
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
    this._scene.enablePhysics(new Vector3(config.physics.x, config.physics.y, config.physics.z), havokPlugin);
  }

  onSceneReady(): void {
    if (config.camera.activateDevCamera) {
      this.devCamera();
    } else {
      this.gameCamera();
    }
  }

  private gameCamera(): void {
    // This creates and positions a free camera (non-mesh)
    this._camera = new ArcRotateCamera(
      'camera',
      config.camera.arcRotateCamera.alpha,
      config.camera.arcRotateCamera.beta,
      config.camera.arcRotateCamera.radius,
      new Vector3(
        config.camera.arcRotateCamera.direction.x,
        config.camera.arcRotateCamera.direction.y,
        config.camera.arcRotateCamera.direction.z,
      ),
      this.scene,
    );

    // The target should also be adjusted so that the camera is looking at the correct location
    this._camera.setTarget(
      new Vector3(
        config.camera.arcRotateCamera.target.x,
        config.camera.arcRotateCamera.target.y,
        config.camera.arcRotateCamera.target.z,
      ),
    );

    // This attaches the camera to the canvas
    this._camera.mode = Camera.PERSPECTIVE_CAMERA;
    this._camera.speed = config.camera.speed;
    this._camera.fov = config.camera.fov;

    const canvas = this.scene.getEngine().getRenderingCanvas();

    // This attaches the camera to the canvas
    this._camera.attachControl(canvas, true);
    this._camera.inputs.clear();
    this._arcRotateCameraKeyboardInputs = new ArcRotateCameraKeyboardInputs(this._camera, this._gameCorePresenter);
    this._camera.inputs.add(this._arcRotateCameraKeyboardInputs);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight(
      'light',
      new Vector3(config.light.direction.x, config.light.direction.y, config.light.direction.z),
      this.scene,
    );

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = config.light.intensity;

    this._arcRotateCameraKeyboardInputs.attachControl(true);
  }

  private devCamera(): void {
    // This creates and positions a free camera (non-mesh)
    const camera = new FreeCamera(
      'camera1',
      new Vector3(
        config.camera.devCamera.direction.x,
        config.camera.devCamera.direction.y,
        config.camera.devCamera.direction.z,
      ),
      this.scene,
    );

    // This targets the camera to scene origin
    camera.setTarget(
      new Vector3(config.camera.devCamera.target.x, config.camera.devCamera.target.y, config.camera.devCamera.target.z),
    );

    const canvas = this.scene.getEngine().getRenderingCanvas();

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight(
      'light',
      new Vector3(config.light.direction.x, config.light.direction.y, config.light.direction.z),
      this.scene,
    );

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = config.light.intensity;
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
