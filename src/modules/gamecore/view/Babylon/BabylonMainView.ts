import {
  Camera,
  Engine,
  EngineOptions,
  HemisphericLight,
  Scene,
  SceneOptions,
  Tools,
  UniversalCamera,
  Vector3,
} from '@babylonjs/core';
import { FreeCameraKeyboardInputs } from './FreeCameraKeyboardInputs.ts';

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

class BabylonMainView {
  private _options: BabylonMainViewOptions;
  private _canvas!: HTMLCanvasElement;
  private _engine!: Engine;
  private _scene!: Scene;

  constructor(options?: BabylonMainViewOptions) {
    this._options = { ...DEFAULT_OPTIONS, ...options };
  }

  init(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    if (!this._canvas) throw new Error('Canvas not found');
    this._engine = new Engine(
      this._canvas,
      this._options.antialias,
      this._options.engineOptions,
      this._options.adaptToDeviceRatio,
    );
    this._scene = new Scene(this._engine, this._options.sceneOptions);
  }

  onSceneReady(): void {
    const canvas = this._scene.getEngine().getRenderingCanvas();

    // This creates and positions a free camera (non-mesh)
    const camera = new UniversalCamera('camera1', new Vector3(0, 100, -50), this.scene);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    // This attaches the camera to the canvas
    camera.mode = Camera.PERSPECTIVE_CAMERA;
    camera.speed = 0.1;
    camera.fov = 1.0;

    camera.metadata = {
      // mouse & keyboard properties
      // Set by camera inputs. Defines, which input moves the camera (mouse or keys)
      movedBy: null,
      // target position, the camera should be moved to
      targetPosition: camera.position.clone(),
      // radius, that is used to rotate camera
      // initial value dependent from camera position and camera target
      radius: new Vector3(camera.position.x, 0, camera.position.z)
        .subtract(new Vector3(camera.target.x, 0, camera.target.z))
        .length(),
      // helper variable, to rotate camera
      rotation: Tools.ToRadians(180) + camera.rotation.y,
      // speed for rotation
      rotationSpeed: 0.02,
      // boundaries for x and z
      minX: -30,
      maxX: 30,
      minZ: -30,
      maxZ: 30,

      // mousewheel properties
      // similar to targetPosition, targetZoom contains the target value for the zoom
      targetZoom: camera.fov,
      // zoom boundaries
      maxZoom: 1.4,
      minZoom: 0.5,
      // speed for zoom
      zoom: 0.005,
      // zoom distance per mouse wheel interaction
      zoomSteps: 0.2,
    };

    camera.inputs.clear();
    camera.attachControl(canvas, true);
    camera.inputs.add(new FreeCameraKeyboardInputs(camera));

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight('light', new Vector3(0, 1, 0), this._scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
  }

  onRender(): void {
    this._engine.runRenderLoop(() => {
      if (this._scene) {
        this._scene.render();
      }
    });
    window.addEventListener('resize', () => {
      this._engine.resize();
    });
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

  set canvas(value: HTMLCanvasElement) {
    this._canvas = value;
  }
}

export { BabylonMainView };
