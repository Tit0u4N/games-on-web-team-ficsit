import { TournamentPresenter } from '../../presenter/TournamentPresenter.ts';
import { BracketObject, Bracketv1 } from './bracket/Bracketv1.tsx';
import React from 'react';
import { Button, Divider, ModalBody } from '@nextui-org/react';

interface Props {
  tournament: TournamentPresenter;
}

export const TournamentBracketView: React.FC<Props> = ({ tournament }) => {
  return (
    <ModalBody>
      <div className={'flex gap-3 h-full m-1'}>
        <Bracketv1 bracket={BracketObject.buildFromRoundList(tournament.tournamentModel.rounds)} />
        <Divider orientation={'vertical'} />
        <div className={'flex-col flex gap-2 p-4 mr-4 h-full justify-center'}>
          <Button onPress={tournament.playNextRound()}>Next round</Button>
        </div>
      </div>
    </ModalBody>
  );
};
