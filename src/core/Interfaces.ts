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

interface IArcRotateCameraKeyboardInputsKeysConfig {
  keysUp: string[];
  keysDown: string[];
  keysLeft: string[];
  keysRight: string[];
  keysZoomIn: string[];
  keysZoomOut: string[];
  resetPosition: string[];
}

interface IArcRotateCameraKeyboardInputsConfig {
  controls: {
    keys: IArcRotateCameraKeyboardInputsKeysConfig;
  };
  config: {
    defaultPositionHeight: number;
    defaultTargetHeight: number;
    maxYZoomIn: number;
    maxYZoomOut: number;
  };
  resetPositionCamera: {
    direction: IVector3Config;
    target: IVector3Config;
  };
}

interface IVector3Config {
  x: number;
  y: number;
  z: number;
}

interface IBabylonMainViewLightConfig {
  direction: IVector3Config;
  intensity: number;
}

interface IBabylonMainViewConfig {
  init: {
    physics: IVector3Config;
  };
  gameCamera: {
    speed: number;
    fov: number;
    alpha: number;
    beta: number;
    radius: number;
    direction: IVector3Config;
    target: IVector3Config;
    light: IBabylonMainViewLightConfig;
  };
  devCamera: {
    speed: number;
    fov: number;
    direction: IVector3Config;
    target: IVector3Config;
    light: IBabylonMainViewLightConfig;
  };
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

interface ITileViewConfig {
  radius: number;
  createHexagonMesh: {
    mass: number;
  };
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

interface ITileViewFactoryConfig {
  radius: number;
  createBaseTile: {
    tessellation: number;
    alphaTypeTileAccessible: number;
  };
  getDiameter: {
    diameterTypeTileAccessible: number;
  };
  getHeight: ITileViewFactoryGetHeightConfig;
  getColor: ITileViewFactoryGetColorConfig;
}

interface IMapViewConfig {
  tileView: ITileViewConfig;
  tileViewFactory: ITileViewFactoryConfig;
}

interface INoiseMapConfig {
  get: {
    noiseModifier: number;
    noiseScale: number;
  };
}

interface ITileModelConfig {
  getTypeByBiome: {
    maxNoiseValue: number;
  };
}

interface ITileModelUtilsConfig {
  subBiomeTilesIdentifier: {
    maxRecursiveIterations: number;
  };
}

interface ITileModelBiomeAbstractModelConfig {
  getBiomeByNoiseValue: {
    moutainNoseValue: number;
    plainNoseValue: number;
    lowPlainNoseValue: number;
    desertNoseValue: number;
  };
}

interface ITileModelBiomeMountainModelConfig {
  initializeSubBiomes: {
    maxRecursiveIterations: number;
  };
}

interface ITileModelBiomeConfig {
  biomeAbstractModel: ITileModelBiomeAbstractModelConfig;
  biomeMountainModel: ITileModelBiomeMountainModelConfig;
}

interface IMapModelConfig {
  noiseMap: INoiseMapConfig;
  tileModel: ITileModelConfig;
  utils: ITileModelUtilsConfig;
  biome: ITileModelBiomeConfig;
}

interface IMapConfig {
  core: IMapCoreConfig;
  model: IMapModelConfig;
  view: IMapViewConfig;
}

interface ISportConfig {
  all: { name: string; icon: string; description: string; seasons: string[] }[];
}

interface ISeasonConfig {
  all: { name: string; icon: string }[];
}

interface IStatisticsConfig {
  setDefaultStats: boolean;
}

interface IInventoryConfig {
  maxItemsEquipped: number;
}

interface IUsableObjectConfig {
  basePath: string;
}

interface IConfig {
  babylonMainView: IBabylonMainViewConfig;
  arcRotateCameraKeyboardInputs: IArcRotateCameraKeyboardInputsConfig;
  buildings: IBuildingsConfig;
  map: IMapConfig;
  sports: ISportConfig;
  seasons: ISeasonConfig;
  statistics: IStatisticsConfig;
  inventory: IInventoryConfig;
  usableObject: IUsableObjectConfig;
}

export const config: IConfig = configJson;

interface IArcRotateCameraKeyboardInputsDebugConfig {
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

interface IBabylonMainViewDebugConfig {
  constructor: boolean;
  init: boolean;
  onSceneReady: boolean;
  gameCamera: boolean;
  devCamera: boolean;
  onRender: boolean;
}

interface ILogDebugConfig {
  arcRotateCameraKeyboardInputs: IArcRotateCameraKeyboardInputsDebugConfig;
  babylonMainView: IBabylonMainViewDebugConfig;
}

interface IDebugConfig {
  logs: ILogDebugConfig;
  activateDevCamera: boolean;
}

export const debugConfig: IDebugConfig = debugConfigJson;
