import { MenuView } from './MenuView.tsx';
import { Main } from './Main.tsx';
import React from 'react';
import { GameCorePresenter } from '../../presenter/Presenter.ts';

interface ViewProps {
  presenter: GameCorePresenter;
}

export class View extends React.Component<ViewProps> {
  status: string;
  presenter: GameCorePresenter;

  constructor(props: ViewProps) {
    super(props);
    this.presenter = props.presenter;
    console.log('View created');
    this.status = 'menu';
  }

  public start() {
    console.log('Game started');
    this.status = 'game';
    this.presenter.notifyViewChange();
  }

  render() {
    if (this.status === 'menu') {
      return <MenuView view={this} />;
    } else {
      return <Main />;
    }
  }
}
