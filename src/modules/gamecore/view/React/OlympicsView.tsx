import { GameCorePresenter } from '@gamecore/presenter/GameCorePresenter.ts';
import React from 'react';
import { Card } from '@nextui-org/react';
import { TeamView } from '@/modules/olympics/view/React/TeamView.tsx';

interface OlympicsViewProps {
  presenter: GameCorePresenter;
}

export const OlympicsView: React.FC<OlympicsViewProps> = ({ presenter }) => {
  const olympicsPresenter = presenter.olympicsPresenter;
  console.log(olympicsPresenter.olympicsModel.teams);
  return (
    <div className={'h-[100vh] w-[100vw] bg-menu bg-cover'}>
      <div className={'size-full backdrop-blur flex items-center justify-center '}>
        <div className={'mt-[-50px] h-[640px]'}>
          <Card className="w-[500px] h-[600px] p-2 pb-4 flex-row flex-wrap gap-2">
            {olympicsPresenter.olympicsModel.teams.map((team, index) => (
              <TeamView team={team} key={index} />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};
