import React from 'react';
import { GameCorePresenter } from '@gamecore/presenter/GameCorePresenter.ts';
import { MenuView } from './MenuView.tsx';
import { GameView } from './GameView.tsx';
import { ApplicationStatus } from '@gamecore/presenter/ApplicationStatus.ts';
import { LoadingScreen } from '@/component/LoadingScreen.tsx';

interface MainComponentProps {
  gameCorePresenter: GameCorePresenter;
}

// MainComponent is the main component of the game. It is responsible for rendering the main component where other components are called.
export class MainComponent extends React.Component<MainComponentProps> {
  constructor(props: MainComponentProps) {
    super(props);
    this.handleViewChange = this.handleViewChange.bind(this);

    this.state = {
      isLoading: true,
    };

    this.props.gameCorePresenter.setIsLoading = (isLoading: boolean) => {
      this.setIsLoading(isLoading);
    };
  }

  setIsLoading(isLoading: boolean) {
    this.setState({ isLoading: isLoading });
  }

  getIsLoading() {
    //@ts-ignore
    return this.state.isLoading;
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
        {this.props.gameCorePresenter.getStatus() === ApplicationStatus.MENU ? (
          <MenuView presenter={this.props.gameCorePresenter} />
        ) : (
          <>
            <LoadingScreen isLoading={this.getIsLoading()} />
            <GameView presenter={this.props.gameCorePresenter} />
          </>
        )}
      </>
    );
  }
}
