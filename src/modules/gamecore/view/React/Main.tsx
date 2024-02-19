import { View } from '../Babylon/View.ts';
import BabylonScene from '../../../../component/BabylonScene.tsx';

export const GameView = () => {
  const view = new View();
  const babylon = view.init();

  return (
    <div>
      <BabylonScene antialias={true} onSceneReady={babylon.onSceneReady} onRender={babylon.onRender} id="my-canvas" />
    </div>
  );
};
