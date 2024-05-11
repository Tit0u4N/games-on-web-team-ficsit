import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React from 'react';
import { ArenaPresenter } from '../../presenter/ArenaPresenter.ts';
import { TournamentView } from '../../../tournament/view/React/TournamentView.tsx';
import { TournamentPreView } from '../../../tournament/view/React/TournamentPreView.tsx';
import { Bracketv2 } from '../../../tournament/view/React/bracket/Bracketv2.tsx';
import { ModalManager } from '../../../../core/singleton/ModalManager.ts';

export interface ArenaLayoutProps {
  arena: ArenaPresenter;
  isOpen: boolean;
  onClose: () => void;
}

export const ArenaLayout: React.FC<ArenaLayoutProps> = ({ arena, isOpen, onClose }) => {
  const [hideModal, setHideModal] = React.useState<boolean>(false);
  const [isInPool, setIsInPool] = React.useState<boolean>(false);
  const [isTournamentStarted, setIsTournamentStarted] = React.useState<boolean>(false);

  arena.setUpdateView(() => {
    setIsInPool(arena.tournamentPresenter.isInPool);
    setIsTournamentStarted(arena.tournamentPresenter.isTournamentStarted);
  });

  const [, handle] = React.useState(true);
  ModalManager.getInstance().modalUpdaterHandler = handle;

  return (
    <Modal isOpen={isOpen && !hideModal} onClose={onClose} className={'h-[80%] w-[80%] max-w-full'}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Arena</ModalHeader>
        {arena.hasTournament() ? (
          isTournamentStarted ? (
            isInPool ? (
              <TournamentView tournament={arena.tournamentPresenter} setHideModal={setHideModal} />
            ) : (
              // <div className="flex justify-center items-center h-[50%] w-full">
              //   <h1>No tournament</h1>
              // </div>
              <Bracketv2 />
            )
          ) : (
            <>
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
            </>
          )
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
