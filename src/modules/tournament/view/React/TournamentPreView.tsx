import { TournamentPresenter } from '../../presenter/TournamentPresenter.ts';
import React from 'react';
import { UsableObjectView } from '../../../object/view/React/UsableObjectView.tsx';
import { Divider, Image } from '@nextui-org/react';
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
      <span id={'TournamentDifficulty'}>
        <p>
          Difficulty: <span className="font-semibold">{tournament.tournamentModel.difficulty}</span>
        </p>
      </span>
      <span id={'BracketNumberTournamentPreview'}>
        <p>Number of bracket: {tournament.tournamentModel.numberRound}</p>
      </span>
      <span id={'SportTournament'}>
        <p>Sport:</p>
        <div className="flex gap-1 my-2">
          <Image src={tournament.tournamentModel.sport.iconPath} height={40} width={40} />
          <p>{tournament.tournamentModel.sport.name}</p>
        </div>
      </span>
      <Divider className="my-4" />
      <p>Rewards:</p>
      <div className="flex gap-1 max-h-fit h-fit justify-center" id={'AllReward'}>
        {tournament.tournamentModel.reward
          .sort((a, b) => a.rankToReach - b.rankToReach)
          .map((reward, index) => (
            <div className="w-1/6 h-fit" key={index} id={index === 0 ? 'FirstReward' : ''}>
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
