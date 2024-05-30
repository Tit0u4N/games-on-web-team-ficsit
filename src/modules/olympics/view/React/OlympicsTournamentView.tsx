import { OlympicsPresenter } from '@/modules/olympics/presenter/OlympicsPresenter.ts';
import React, { FC } from 'react';
import { TournamentBracketView } from '@tournament/view/React/TournamentBracketView.tsx';
import { TournamentView } from '@tournament/view/React/TournamentView.tsx';
import { TournamentEndView } from '@tournament/view/React/TournamentEndView.tsx';

interface OlympicsTournamentViewProps {
  presenter: OlympicsPresenter;
  setHideModal: (hideModal: boolean) => void;
}

export const OlympicsTournamentView: FC<OlympicsTournamentViewProps> = ({ presenter, setHideModal }) => {
  const tournamentPresenter = presenter.getCurrentTournamentPresenter();
  const [onStatusChange, setOnStatusChange] = React.useState(true);
  return (
    <>
      {tournamentPresenter.tournamentModel.tournamentStatus === 'inProgress' ? (
        <TournamentBracketView
          tournament={tournamentPresenter}
          onStatusChange={() => setOnStatusChange(!onStatusChange)}
        />
      ) : tournamentPresenter.tournamentModel.tournamentStatus === 'inPool' ? (
        <TournamentView tournament={tournamentPresenter} setHideModal={setHideModal} />
      ) : (
        <TournamentEndView tournament={tournamentPresenter} />
      )}
    </>
  );
};
