import { Button, Modal, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React from 'react';
import { ArenaPresenter } from '../../presenter/ArenaPresenter.ts';
import { TournamentView } from '../../../tournament/view/React/TournamentView.tsx';

export interface ArenaLayoutProps {
  arena: ArenaPresenter;
  isOpen: boolean;
  onClose: () => void;
}

export const ArenaLayout: React.FC<ArenaLayoutProps> = ({ arena, isOpen, onClose }) => {
  const [hideModal, setHideModal] = React.useState<boolean>(false);

  return (
    <Modal isOpen={isOpen && !hideModal} onClose={onClose} className={'h-[80%] w-[80%] max-w-full'}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Arena</ModalHeader>
        {arena.hasTournament() ? (
          <TournamentView tournament={arena.tournamentPresenter} setHideModal={setHideModal} />
        ) : (
          <div className="flex justify-center items-center h-[50%] w-full">
            <h1>No tournament</h1>
          </div>
        )}
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
            Close
          </Button>
          <Button color="primary" onClick={onClose}>
            Action
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
