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

interface IArenaConfig {
  numberOfBuildings: number;
  spacing: number;
}

interface ITrainingCenterConfig {
  numberOfBuildings: number;
  spacing: number;
}

interface IBuildingsConfig {
  maxAttempts: number;
  arena: IArenaConfig;
  trainingCenter: ITrainingCenterConfig;
}

interface IMapGetPositionConfig {
  modifierX: number;
  modifierY: number;
  defaultDeltaPosition: number;
  deltaXPositionCharacter: number;
  deltaXPositionBuilding: number;
}

interface IMapGamePlacerConfig {
  getPosition: IMapGetPositionConfig;
}

interface IMapCoreConfig {
  gamePlacer: IMapGamePlacerConfig;
}

interface ITileViewCreateHexagonMeshConfig {
  mass: number;
}

interface ITileViewConfig {
  radius: number;
  createHexagonMesh: ITileViewCreateHexagonMeshConfig;
}

interface ITileViewFactoryGetHeightConfig {
  defaultModifierHeight: number;
  snow: number;
  mountain: number;
  forest: number;
  grass: number;
  hillGrass: number;
  hillForest: number;
  sand: number;
  water: number;
  deepWater: number;
  accessible: number;
}

interface ITileViewFactoryGetColorConfig {
  gameColors: {
    snow: string;
    mountain: string;
    forest: string;
    grass: string;
    sand: string;
    water: string;
    deepWater: string;
    hillGrass: string;
    hillSand: string;
    hillForest: string;
    accessible: string;
  };
  debugColors: {
    accessible: string;
    default: string;
    default2: string;
    default3: string;
    default4: string;
    default5: string;
    default6: string;
    default7: string;
    default8: string;
    default9: string;
  };
}

interface ITileViewFactoryCreateBaseTileConfig {
  'tessellation': number;
  'alphaTypeTileAccessible': number;
}

interface ITileViewFactoryGetDiameterConfig {
  diameterTypeTileAccessible: number;
}

interface ITileViewFactoryConfig {
  radius: number;
  createBaseTile: ITileViewFactoryCreateBaseTileConfig;
  getDiameter: ITileViewFactoryGetDiameterConfig;
  getHeight: ITileViewFactoryGetHeightConfig;
  getColor: ITileViewFactoryGetColorConfig;
}

interface IMapViewConfig {
  tileView: ITileViewConfig;
  tileViewFactory: ITileViewFactoryConfig;
}

interface IMapConfig {
  core: IMapCoreConfig;
  view: IMapViewConfig;
}

interface IConfig {
  light: ILight;
  camera: ICameraConfig;
  physics: CustomVector3;
  buildings: IBuildingsConfig;
  map: IMapConfig;
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

interface IBabylonMainView {
  constructor: boolean;
  init: boolean;
  onSceneReady: boolean;
  gameCamera: boolean;
  devCamera: boolean;
  onRender: boolean;
}

interface IDebugConfig {
  arcRotateCameraKeyboardInputs: IArcRotateCameraKeyboardInputs;
  babylonMainView: IBabylonMainView;
}

export const debugConfig: IDebugConfig = debugConfigJson;
