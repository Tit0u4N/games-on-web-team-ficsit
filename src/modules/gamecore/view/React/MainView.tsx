import React from 'react';
import { GameCorePresenter } from '@gamecore/presenter/GameCorePresenter.ts';
import { MenuView } from './MenuView.tsx';
import { GameView } from './GameView.tsx';
import { ApplicationStatus } from '@gamecore/presenter/ApplicationStatus.ts';
import { LoadingScreen } from '@/component/LoadingScreen.tsx';
import { ConfigureCharacters } from '@gamecore/view/React/ConfigureCharacters.tsx';
import { OlympicsView } from '@gamecore/view/React/OlympicsView.tsx';

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
    if (this.props.gameCorePresenter.babylonView.shadowGenerator) {
      this.props.gameCorePresenter.babylonView.scene?.meshes?.forEach((mesh) => {
        this.props.gameCorePresenter.babylonView.shadowGenerator.addShadowCaster(mesh);
      });
    }
  }

  render() {
    const currentStatus = this.props.gameCorePresenter.getStatus();

    return (
      <>
        {React.createElement(
          GameCorePresenter.AUDIO_PRESENTER.getReactView().type,
          GameCorePresenter.AUDIO_PRESENTER.getReactView().props,
        )}
        {currentStatus === ApplicationStatus.MENU ? (
          <MenuView presenter={this.props.gameCorePresenter} />
        ) : currentStatus === ApplicationStatus.CONFIGURE_CHARACTERS ? (
          <ConfigureCharacters presenter={this.props.gameCorePresenter} />
        ) : (
          <>
            <LoadingScreen isLoading={this.getIsLoading()} />
            <GameView presenter={this.props.gameCorePresenter} />
            {currentStatus === ApplicationStatus.OLYMPICS && <OlympicsView presenter={this.props.gameCorePresenter} />}
          </>
        )}
      </>
    );
  }
}
