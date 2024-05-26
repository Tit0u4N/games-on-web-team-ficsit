import { TournamentPresenter } from '../../presenter/TournamentPresenter.ts';
import React from 'react';
import { UsableObjectView } from '../../../object/view/React/UsableObjectView.tsx';
import { Divider } from '@nextui-org/react';
import { RewardModel } from '../../model/RewardModel.ts';

interface Props {
  tournament: TournamentPresenter;
}

export const TournamentPreView: React.FC<Props> = ({ tournament }) => {
  const unlockConditionText = (reward: RewardModel, previous?: RewardModel) => {
    if (reward.keepIfBetterReward) return '+' + reward.rankToReach + ' position';
    return (previous ? previous.rankToReach + 1 + '-' + reward.rankToReach : reward.rankToReach) + ' position';
  };
  return (
    <div className={'m-4 h-100 border-2 p-4 rounded-lg'}>
      <p>Difficulty: {tournament.tournamentModel.difficulty}</p>
      <p>Number of bracket: {tournament.tournamentModel.numberRound}</p>
      <p>Sport: {tournament.tournamentModel.sport.name}</p>
      <Divider className="my-4" />
      <p>Rewards:</p>
      <div className="flex gap-1 h-1/4 max-h-[200px] justify-center">
        {tournament.tournamentModel.reward
          .sort((a, b) => a.rankToReach - b.rankToReach)
          .map((reward, index) => (
            <div className="w-1/6 h-full" key={index}>
              <p>
                {unlockConditionText(reward, index !== 0 ? tournament.tournamentModel.reward[index - 1] : undefined)}
              </p>
              <UsableObjectView key={index} item={reward.reward} handleDragStart={() => {}} />
            </div>
          ))}
      </div>
    </div>
  );
};
