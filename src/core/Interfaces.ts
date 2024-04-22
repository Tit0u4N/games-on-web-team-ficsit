import { Scene } from '@babylonjs/core';
import * as configJson from './config.json';
import * as debugConfigJson from './debugConfig.json';

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

interface CustomVector3 {
  x: number;
  y: number;
  z: number;
}

interface ILight {
  direction: CustomVector3;
  intensity: number;
}

interface IKeys {
  keysLeft: string[];
  keysRight: string[];
  keysUp: string[];
  keysDown: string[];
  keysZoomIn: string[];
  keysZoomOut: string[];
}

interface IControlsConfig {
  maxYZoomIn: number;
  maxYZoomOut: number;
  defaultPositionHeight: number;
  defaultTargetHeight: number;
}

interface IControls {
  keys: IKeys;
}

interface IArcRotateCamera {
  controls: IControls;
  config: IControlsConfig;
  alpha: number;
  beta: number;
  radius: number;
  direction: CustomVector3;
  target: CustomVector3;
}

interface IDevCamera {
  direction: CustomVector3;
  target: CustomVector3;
}

interface ICameraConfig {
  activateDevCamera: boolean;
  speed: number;
  fov: number;
  arcRotateCamera: IArcRotateCamera;
  devCamera: IDevCamera;
}

interface IArena {
  numberOfBuildings: number;
  spacing: number;
}

interface ITrainingCenter {
  numberOfBuildings: number;
  spacing: number;
}

interface IBuildings {
  maxAttempts: number;
  arena: IArena;
  trainingCenter: ITrainingCenter;
}

interface IConfig {
  light: ILight;
  camera: ICameraConfig;
  physics: CustomVector3;
  buildings: IBuildings;
}

export const config: IConfig = configJson;

interface IArcRotateCameraKeyboardInputs {
  constructor: boolean;
  attachControl: boolean;
  isCameraMoveKey: boolean;
  checkInputs: boolean;
  checkKeyInputs: boolean;
  checkTargetIsWithinMapLimits: boolean;
  checkMovementIsPossible: boolean;
  detachControl: boolean;
  getSimpleName: boolean;
  getClassName: boolean;
  resetPositionCamera: boolean;
}

interface IDebugConfig {
  arcRotateCameraKeyboardInputs: IArcRotateCameraKeyboardInputs
}

export const debugConfig: IDebugConfig = debugConfigJson;
