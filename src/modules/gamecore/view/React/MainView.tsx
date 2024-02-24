import React from 'react';
import { GameCorePresenter } from '../../presenter/Presenter.ts';
import { MenuView } from './MenuView.tsx';
import { GameView } from './GameView.tsx';

interface MainComponentProps {
  gameCorePresenter: GameCorePresenter;
}

// MainComponent is the main component of the game. It is responsible for rendering the main component where other components are called.
export class MainComponent extends React.Component<MainComponentProps> {
  constructor(props: MainComponentProps) {
    super(props);
    this.handleViewChange = this.handleViewChange.bind(this);
  }

  componentDidMount() {
    this.props.gameCorePresenter.subscribeToViewChanges(this.handleViewChange);
  }

  handleViewChange() {
    this.forceUpdate();
  }

  render() {
    return (
      <>
        {this.props.gameCorePresenter.getStatus() === 'menu' ? (
          <MenuView presenter={this.props.gameCorePresenter} />
        ) : (
          <GameView
            presenter={this.props.gameCorePresenter}
            babylon={this.props.gameCorePresenter.getBabylonViewSetup()}
          />
        )}
      </>
    );
  }
}
