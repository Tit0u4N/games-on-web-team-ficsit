import {
  ArcRotateCamera,
  Camera,
  CascadedShadowGenerator,
  DirectionalLight,
  Engine,
  EngineOptions,
  FreeCamera,
  HavokPlugin,
  HemisphericLight,
  Light,
  Scene,
  SceneOptions,
  ShadowGenerator,
  ShadowLight,
  Vector3,
} from '@babylonjs/core';
import HavokPhysics from '@babylonjs/havok';
import { ArcRotateCameraKeyboardInputs } from './ArcRotateCameraKeyboardInputs.ts';
import { GameCorePresenter } from '@gamecore/presenter/GameCorePresenter.ts';
import { config, debugConfig } from '@/core/Interfaces.ts';
import { Inspector } from '@babylonjs/inspector';
import { GameOptions } from '@/core/GameOptions.ts';

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

    if (debugConfig.babylonInspector.enabled) Inspector.Show(this._scene, debugConfig.babylonInspector.options);

    const havokPlugin = new HavokPlugin(true, await HavokPhysics());
    this._scene.enablePhysics(
      new Vector3(
        config.babylonMainView.init.physics.x,
        config.babylonMainView.init.physics.y,
        config.babylonMainView.init.physics.z,
      ),
      havokPlugin,
    );
  }

  onSceneReady(): void {
    if (debugConfig.activateDevCamera) {
      this.devCamera();
    } else {
      this.gameCamera();
    }
  }

  private gameCamera(): void {
    // This creates and positions a free camera (non-mesh)
    this._camera = new ArcRotateCamera(
      'camera',
      config.babylonMainView.gameCamera.alpha,
      config.babylonMainView.gameCamera.beta,
      config.babylonMainView.gameCamera.radius,
      new Vector3(
        config.babylonMainView.gameCamera.direction.x,
        config.babylonMainView.gameCamera.direction.y,
        config.babylonMainView.gameCamera.direction.z,
      ),
      this.scene,
    );

    // The target should also be adjusted so that the camera is looking at the correct location
    this._camera.setTarget(
      new Vector3(
        config.babylonMainView.gameCamera.target.x,
        config.babylonMainView.gameCamera.target.y,
        config.babylonMainView.gameCamera.target.z,
      ),
    );

    // This attaches the camera to the canvas
    this._camera.mode = Camera.PERSPECTIVE_CAMERA;
    this._camera.speed = config.babylonMainView.gameCamera.speed;
    this._camera.fov = config.babylonMainView.gameCamera.fov;

    const canvas = this.scene.getEngine().getRenderingCanvas();

    // This attaches the camera to the canvas
    this._camera.attachControl(canvas, true);
    this._camera.inputs.clear();
    this._camera.allowUpsideDown = false;
    if (debugConfig.logs.babylonMainView.gameCamera) console.log('this._camera.inputs', this._camera.inputs);
    this._arcRotateCameraKeyboardInputs = new ArcRotateCameraKeyboardInputs(this._camera, this._gameCorePresenter);
    this._camera.inputs.add(this._arcRotateCameraKeyboardInputs);

    this.createLight();

    this._arcRotateCameraKeyboardInputs.attachControl(true);
  }

  createLight(): DirectionalLight | HemisphericLight {
    let light: DirectionalLight | HemisphericLight;
    if (GameOptions.instance.shadows) {
      light = new DirectionalLight('sunLight', new Vector3(-1, -1, -1), this.scene);
      light.position = new Vector3(0, 80, 0);
      light.shadowEnabled = true;

      light.intensity = 1;
      light.shadowMinZ = -180;
      light.shadowMaxZ = 260;
    } else {
      console.log('shadow disabled');
      // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
      light = new HemisphericLight(
        'light',
        new Vector3(
          config.babylonMainView.devCamera.light.direction.x,
          config.babylonMainView.devCamera.light.direction.y,
          config.babylonMainView.devCamera.light.direction.z,
        ),
        this.scene,
      );

      // Default intensity is 1. Let's dim the light a small amount
      light.intensity = config.babylonMainView.devCamera.light.intensity;
    }

    return light;
  }

  private devCamera(): void {
    // This creates and positions a free camera (non-mesh)
    const camera = new FreeCamera(
      'camera1',
      new Vector3(
        config.babylonMainView.devCamera.direction.x,
        config.babylonMainView.devCamera.direction.y,
        config.babylonMainView.devCamera.direction.z,
      ),
      this.scene,
    );

    // This targets the camera to scene origin
    camera.setTarget(
      new Vector3(
        config.babylonMainView.devCamera.target.x,
        config.babylonMainView.devCamera.target.y,
        config.babylonMainView.devCamera.target.z,
      ),
    );

    const canvas = this.scene.getEngine().getRenderingCanvas();

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
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
