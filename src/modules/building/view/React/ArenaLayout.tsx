import { Button, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import React from 'react';
import { ArenaPresenter } from '../../presenter/ArenaPresenter.ts';
import { TournamentView } from '../../../tournament/view/React/TournamentView.tsx';
import { TournamentPreView } from '../../../tournament/view/React/TournamentPreView.tsx';
import { ModalManager } from '../../../../core/singleton/ModalManager.ts';
import { TournamentBracketView } from '../../../tournament/view/React/TournamentBracketView.tsx';
import { TournamentEndView } from '../../../tournament/view/React/TournamentEndView.tsx';

export interface ArenaLayoutProps {
  arena: ArenaPresenter;
  isOpen: boolean;
  onClose: () => void;
}

export const ArenaLayout: React.FC<ArenaLayoutProps> = ({ arena, isOpen, onClose }) => {
  const [, handle] = React.useState(true);
  ModalManager.getInstance().modalUpdaterHandler = handle;

  const [hideModal, setHideModal] = React.useState<boolean>(false);

  const buildTournament = (status: 'notStarted' | 'inProgress' | 'inPool' | 'finished', arena: ArenaPresenter) => {
    switch (status) {
      case 'notStarted':
        return (
          <ModalBody>
            <TournamentPreView tournament={arena.tournamentPresenter}></TournamentPreView>
            Your characters in arena: {arena.charactersInArena().size}
            <Button
              onPress={() => {
                arena.startTournament();
              }}
              isDisabled={arena.charactersInArena().size === 0}>
              Start tournament
            </Button>
          </ModalBody>
        );
      case 'inProgress':
        return <TournamentBracketView tournament={arena.tournamentPresenter} />;
      case 'inPool':
        return <TournamentView tournament={arena.tournamentPresenter} setHideModal={setHideModal} />;
      case 'finished':
        return <TournamentEndView tournament={arena.tournamentPresenter} />;
    }
  };

  return (
    <Modal
      isOpen={isOpen && !hideModal}
      onClose={onClose}
      className={'h-[80%] w-[80%] max-w-full'}
      isDismissable={arena.tournamentPresenter.isTournamentStarted}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Arena</ModalHeader>
        {arena.hasTournament() ? (
          buildTournament(arena.tournamentPresenter.tournamentModel.tournamentStatus, arena)
        ) : (
          <div className="flex justify-center items-center h-[50%] w-full">
            <h1>No tournament</h1>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};
