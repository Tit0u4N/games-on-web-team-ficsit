import { TournamentPresenter } from '../../presenter/TournamentPresenter.ts';
import React from 'react';

interface Props {
  tournament: TournamentPresenter;
}

export const TournamentPreView: React.FC<Props> = ({ tournament }) => {
  return (
    <div className={'m-4 h-100 border-2 p-4 rounded-lg'}>
      <p>Difficulty: {tournament.tournamentModel.difficulty}</p>
      <p>Number of bracket: {tournament.tournamentModel.numberRound}</p>
      <p>Sport: {tournament.tournamentModel.sport.name}</p>
      <p>{tournament.tournamentModel.reward.reward?.name}</p>
      <p>{tournament.tournamentModel.reward.reward?.name}</p>
    </div>
  );
};
