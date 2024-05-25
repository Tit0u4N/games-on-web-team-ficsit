import { TournamentPresenter } from '../../presenter/TournamentPresenter.ts';
import { BracketObject, Bracketv1 } from './bracket/Bracketv1.tsx';
import React from 'react';
import { Button, Divider, ModalBody } from '@nextui-org/react';
import { ModalManager } from '../../../../core/singleton/ModalManager.ts';

interface Props {
  tournament: TournamentPresenter;
}

export const TournamentBracketView: React.FC<Props> = ({ tournament }) => {
  const bracketObjects = BracketObject.buildFromRoundList(tournament.tournamentModel.rounds);
  const [isNextRoundDisabled, setIsNextRoundDisabled] = React.useState<boolean>(false);
  const nextRound = () => {
    if (tournament.tournamentModel.tournamentStatus !== 'finished') {
      bracketObjects.getPool(tournament.tournamentModel.currentRound, tournament.tournamentModel.currentPool)!.opener!(
        true,
      );
      bracketObjects
        .getPool(tournament.tournamentModel.currentRound, tournament.tournamentModel.currentPool)!
        .startLoading();
    }
    setIsNextRoundDisabled(true);
    setTimeout(() => {
      setIsNextRoundDisabled(false);
      if (tournament.tournamentModel.tournamentStatus === 'finished') ModalManager.getInstance().updateCurrentModal();
    }, 1000);
    tournament.playNextRound();
  };

  return (
    <ModalBody>
      <div className={'flex gap-3 h-full m-1'}>
        <Bracketv1 bracket={bracketObjects} />
        <Divider orientation={'vertical'} />
        <div className={'flex-col flex gap-2 p-4 mr-4 h-full justify-center'}>
          <Button onPress={() => nextRound()} isDisabled={isNextRoundDisabled}>
            Next round
          </Button>
        </div>
      </div>
    </ModalBody>
  );
};
