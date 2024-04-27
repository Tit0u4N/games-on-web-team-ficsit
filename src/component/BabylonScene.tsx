import React, { useEffect, useRef } from 'react';
import { BabylonMainView } from '../modules/gamecore/view/Babylon/BabylonMainView.ts';
import { Scene } from '@babylonjs/core';

type Props = {
  babylonMainView: BabylonMainView;
};
export const BabylonScene: React.FC<Props> = ({ babylonMainView, ...rest }: Props) => {
  const reactCanvas = useRef<HTMLCanvasElement>(null);

  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    let scene: null | Scene = null;
    if (!canvas) return;
    babylonMainView.init(canvas).then(() => {
      const engine = babylonMainView.engine;
      scene = babylonMainView.scene;
      if (scene.isReady()) {
        babylonMainView.onSceneReady();
        engine.runRenderLoop(() => {
          if (typeof babylonMainView.onRender === 'function') babylonMainView.onRender();
          scene?.render();
        });
        window.addEventListener('keydown', (event) => {
          if (event.target !== canvas) canvas.dispatchEvent(new KeyboardEvent('keydown', event));
        });

        window.addEventListener('keyup', (event) => {
          if (event.target !== canvas) canvas.dispatchEvent(new KeyboardEvent('keyup', event));
        });
      }
    });

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const resize = () => {
      if (!scene) return;
      scene.getEngine().resize();
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    if (window) {
      window.addEventListener('resize', resize);
    }

    return () => {
      if (scene) scene.getEngine().dispose();

      if (window) {
        window.removeEventListener('resize', resize);
      }
    };
  }, [babylonMainView]);

  return <canvas className={'size-full'} ref={reactCanvas} {...rest} />;
};
