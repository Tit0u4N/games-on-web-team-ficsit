import { TournamentPresenter } from '../../presenter/TournamentPresenter.ts';
import { BracketObject, Bracketv1 } from './bracket/Bracketv1.tsx';
import React from 'react';
import { Button, Divider, ModalBody } from '@nextui-org/react';

interface Props {
  tournament: TournamentPresenter;
}

export const TournamentBracketView: React.FC<Props> = ({ tournament }) => {
  const bracketObjects = BracketObject.buildFromRoundList(tournament.tournamentModel.rounds);

  const nextRound = () => {
    bracketObjects.getPool(tournament.tournamentModel.currentRound, tournament.tournamentModel.currentPool)!.opener!(
      true,
    );
    setTimeout(() => {
      tournament.playNextRound();
    }, 1000);
  };

  return (
    <ModalBody>
      <div className={'flex gap-3 h-full m-1'}>
        <Bracketv1 bracket={bracketObjects} />
        <Divider orientation={'vertical'} />
        <div className={'flex-col flex gap-2 p-4 mr-4 h-full justify-center'}>
          <Button onPress={() => nextRound()}>Next round</Button>
        </div>
      </div>
    </ModalBody>
  );
};
