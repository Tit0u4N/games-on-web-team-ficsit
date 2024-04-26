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
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="h-[80%] w-[80%] max-w-full" onClick={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Arena</ModalHeader>
        {arena.arenaModel.hasTournament() ? (
          <TournamentView tournament={arena.arenaModel.tournament} />
        ) : (
          <div className="flex justify-center items-center h-[50%] w-full">
            <h1>No tournament</h1>
          </div>
        )}
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
            Close
          </Button>
          <Button color="primary">Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
