import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { NextUIProvider } from '@nextui-org/react';
import { GameCorePresenter } from './modules/gamecore/presenter/Presenter.ts';
import { View } from './modules/gamecore/view/React/View.tsx';

class Main extends React.Component {
  presenter: GameCorePresenter;
  constructor() {
    super({});
    this.presenter = new GameCorePresenter();
    this.handleViewChange = this.handleViewChange.bind(this);
  }

  componentDidMount() {
    this.presenter.subscribeToViewChanges(this.handleViewChange);
  }

  handleViewChange() {
    // Mettre à jour l'état du composant ou effectuer d'autres actions nécessaires
    this.forceUpdate(); // Forcer le composant à se mettre à jour
  }

  render() {
    return (
      <div className={'HUD'}>
        <View presenter={this.presenter} />
      </div>
    );
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <Main />
    </NextUIProvider>
  </React.StrictMode>,
);
