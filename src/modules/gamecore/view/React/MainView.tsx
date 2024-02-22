import ReactDOM from 'react-dom/client';
import React from 'react';
import { NextUIProvider } from '@nextui-org/react';
import { GameCorePresenter } from '../../presenter/Presenter.ts';
import { MenuView } from './MenuView.tsx';
import { GameView } from './GameView.tsx';
import { BabylonView } from '../Babylon/View.ts';

interface MainComponentProps {
  mainView: MainView;
}

// MainComponent is the main component of the game. It is responsible for rendering the main component where other components are called.
class MainComponent extends React.Component<MainComponentProps> {
  constructor(props: MainComponentProps) {
    super(props);
    this.handleViewChange = this.handleViewChange.bind(this);
  }

  componentDidMount() {
    this.props.mainView.subscribeToViewChanges(this.handleViewChange);
  }

  handleViewChange() {
    console.log('View change');
    this.forceUpdate();
  }

  render() {
    return (
      <>
        {this.props.mainView.getStatus() === 'menu' ? (
          <MenuView view={this.props.mainView} />
        ) : (
          <GameView mainView={this.props.mainView} babylon={this.props.mainView.getBabylonViewSetup()} />
        )}
      </>
    );
  }
}

// MainView is the main view of the game. It is responsible for rendering the game's views and for the interactions with the presenter.
export class MainView {
  private readonly presenter: GameCorePresenter;
  private status: string;
  private viewChangeListeners: (() => void)[] = [];
  private babylonView: BabylonView;

  constructor(presenter: GameCorePresenter) {
    this.presenter = presenter;
    this.status = 'menu';
    this.babylonView = new BabylonView();
  }

  public startGame() {
    this.presenter.startGame();
  }

  public startNewGame() {
    this.status = 'game';
    this.notifyViewChange();
    this.babylonView.init();
  }

  public init() {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <NextUIProvider>
          <MainComponent mainView={this} />
        </NextUIProvider>
      </React.StrictMode>,
    );
  }

  public getStatus() {
    return this.status;
  }

  public subscribeToViewChanges(listener: () => void) {
    this.viewChangeListeners.push(listener);
  }

  notifyViewChange() {
    this.viewChangeListeners.forEach((listener) => listener());
  }

  nextRound() {
    this.presenter.nextRound();
  }

  getCurrentRound() {
    return this.presenter.getCurrentRound();
  }

  getBabylonViewSetup() {
    return {
      onSceneReady: this.babylonView.getOnSceneReady(),
      onRender: this.babylonView.getOnRender(),
    };
  }
}
