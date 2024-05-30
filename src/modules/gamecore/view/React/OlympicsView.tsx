import { GameCorePresenter } from '@gamecore/presenter/GameCorePresenter.ts';
import { StandingView } from '@/modules/olympics/view/React/StandingView.tsx';
import { FC } from 'react';
import { OlympicsState } from '@/modules/olympics/model/OlympicsModel.ts';
import { OlympicsTournamentView } from '@/modules/olympics/view/React/OlympicsTournamentView.tsx';

interface OlympicsViewProps {
  presenter: GameCorePresenter;
}

export const OlympicsView: FC<OlympicsViewProps> = ({ presenter }) => {
  return (
    <div className={'h-[100vh] w-[100vw] bg-menu bg-cover'}>
      <div className={'size-full backdrop-blur flex items-center justify-center '}>
        <div className={'w-[85%] h-[85%]'}>
          {presenter.olympicsPresenter.olympicsModel.state == OlympicsState.STANDINGS ? (
            <StandingView presenter={presenter.olympicsPresenter} />
          ) : (
            <OlympicsTournamentView presenter={presenter.olympicsPresenter} />
          )}
        </div>
      </div>
    </div>
  );
};
