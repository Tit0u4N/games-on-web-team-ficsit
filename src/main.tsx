import './index.scss';
import { GameCorePresenter } from './modules/gamecore/presenter/GameCorePresenter.ts';
import ReactDOM from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import { MainComponent } from './modules/gamecore/view/React/MainView.tsx';

const presenter = new GameCorePresenter();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <NextUIProvider>
    <MainComponent gameCorePresenter={presenter} />
  </NextUIProvider>,
);
