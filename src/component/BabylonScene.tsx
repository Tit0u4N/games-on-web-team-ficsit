import React, { useEffect, useRef } from 'react';
import { BabylonMainView } from '../modules/gamecore/view/Babylon/BabylonMainView.ts';

type Props = {
  babylonMainView: BabylonMainView;
};
export const BabylonScene: React.FC<Props> = ({ babylonMainView, ...rest }: Props) => {
  const reactCanvas = useRef<HTMLCanvasElement>(null);

  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;
    babylonMainView.init(canvas);
    const engine = babylonMainView.engine;
    const scene = babylonMainView.scene;

    if (scene.isReady()) {
      babylonMainView.onSceneReady().then(() => {
        engine.runRenderLoop(() => {
          if (typeof babylonMainView.onRender === 'function') babylonMainView.onRender();
          scene.render();
        });
      });
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const resize = () => {
      scene.getEngine().resize();
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    if (window) {
      window.addEventListener('resize', resize);
    }

    return () => {
      scene.getEngine().dispose();

      if (window) {
        window.removeEventListener('resize', resize);
      }
    };
  }, [babylonMainView]);

  return <canvas className={'size-full'} ref={reactCanvas} {...rest} />;
};
