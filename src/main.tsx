import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import BabylonScene from './component/BabylonScene.tsx';
import { FreeCamera, HemisphericLight, Mesh, MeshBuilder, Scene, Vector3 } from '@babylonjs/core';
import { NextUIProvider } from '@nextui-org/react';
import GameCharacterLayout from './modules/character/view/React/GameCharacterLayout';
import { CharacterFactory } from './modules/character/BuilderFactory/CharacterFactory';

let box: Mesh;
const onSceneReady = (scene: Scene): void => {
  console.log('onSceneReady');
  // This creates and positions a free camera (non-mesh)
  const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'box' shape.
  box = MeshBuilder.CreateBox('box', { size: 2 }, scene);

  // Move the box upward 1/2 its height
  box.position.y = 1;

  // Our built-in 'ground' shape.
  MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene);
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene: Scene): void => {
  if (box !== undefined) {
    // DO STUFF HERE
  }
};

const defaultCharacter = CharacterFactory.createDefaultCharacter(1, 'John Doe', 'US', 25, '/vite.svg');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <BabylonScene antialias={true} onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
      <div className={'HUD'}>
        <h1 className={'text-lg'}>
          HUD <span>POSITION</span> FIXED
        </h1>
        <GameCharacterLayout character={defaultCharacter} />
      </div>
    </NextUIProvider>
  </React.StrictMode>,
);
