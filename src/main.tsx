import ReactDOM from 'react-dom/client';
import './index.scss';
import BabylonScene from './component/BabylonScene.tsx';
import { HemisphericLight, Scene, UniversalCamera, Vector3 } from '@babylonjs/core';
import { MapPresenter } from './modules/map/presenter/MapPresenter.ts';

const onSceneReady = (scene: Scene): void => {
  const canvas = scene.getEngine().getRenderingCanvas();

  const camera = new UniversalCamera('UniversalCamera', new Vector3(50, 90, -50), scene);

  // Paramétrez la caméra.
  camera.speed = 6; // Vitesse de déplacement
  camera.inertia = 0.6; // Inertie de mouvement
  camera.angularSensibility = 1000; // Sensibilité de rotation
  camera.attachControl(canvas, true);

  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  const map = new MapPresenter(scene, { size: 30, seed: 1011 });
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene: Scene): void => {};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <BabylonScene antialias={true} onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
    <div className={'HUD'}>
      <h1 className={'text-lg'}>
        HUD <span>POSITION</span> FIXED
      </h1>
    </div>
  </>,
);
