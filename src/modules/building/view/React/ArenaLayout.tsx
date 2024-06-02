import { Button, Divider, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { ArenaPresenter } from '../../presenter/ArenaPresenter.ts';
import { TournamentView } from '@tournament/view/React/TournamentView.tsx';
import { TournamentPreView } from '@tournament/view/React/TournamentPreView.tsx';
import { ModalManager } from '@core/singleton/ModalManager.ts';
import { TournamentBracketView } from '@tournament/view/React/TournamentBracketView.tsx';
import { TournamentEndView } from '@tournament/view/React/TournamentEndView.tsx';
import CharacterLayout from '../../../character/view/React/CharacterLayout.tsx';
import HighlightTutorialSpeech from '@gamecore/view/React/narrator/HighlightTutorialSpeech.tsx';
import { config } from '@core/Interfaces.ts';

export interface ArenaLayoutProps {
  arena: ArenaPresenter;
  isOpen: boolean;
  onClose: () => void;
}

export const ArenaLayout: React.FC<ArenaLayoutProps> = ({ arena, isOpen, onClose }) => {
  const [, handle] = React.useState(true);
  const [onStatusChange, setOnStatusChange] = React.useState<boolean>(false);
  ModalManager.getInstance().modalUpdaterHandler = handle;
  const [isNarrationVisible, setIsNarrationVisible] = useState<boolean>(false);

  const [hideModal, setHideModal] = React.useState<boolean>(false);
  useEffect(() => {
    if (isOpen && !arena.buildingPresenter.hasArenaPreviewShownNarratorBox && config.narratorBox.enabled) {
      setIsNarrationVisible(true);
    }
  }, [isOpen]);
  const buildTournament = (status: 'notStarted' | 'inProgress' | 'inPool' | 'finished', arena: ArenaPresenter) => {
    switch (status) {
      case 'notStarted':
        return (
          <ModalBody>
            <div className="flex">
              <TournamentPreView tournament={arena.tournamentPresenter}></TournamentPreView>
              <Divider className="mx-4" orientation="vertical" />
              <div className="min-w-[500px]" id={'AllAthletes'}>
                <p className="text-lg mb-2 font-semibold">Your characters in arena:</p>
                {arena.charactersInArena().size === 0 && <p>No characters in arena</p>}
                {Array.from(arena.charactersInArena()).map((character, index) => (
                  <div key={index}>
                    <CharacterLayout
                      character={character}
                      isInTournament={true}
                      season={arena.tournamentManagerPresenter.gameCorePresenter.getCurrentSeason()}
                    />
                  </div>
                ))}
              </div>
            </div>
            <Button
              id={'StartButtonTournament'}
              onPress={() => {
                arena.startTournament();
              }}
              isDisabled={arena.charactersInArena().size === 0 || isNarrationVisible}>
              Start tournament
            </Button>
          </ModalBody>
        );
      case 'inProgress':
        return (
          <TournamentBracketView
            tournament={arena.tournamentPresenter}
            onStatusChange={() => setOnStatusChange(!onStatusChange)}
            isOpen={isOpen}
          />
        );
      case 'inPool':
        return <TournamentView tournament={arena.tournamentPresenter} setHideModal={setHideModal} />;
      case 'finished':
        return <TournamentEndView tournament={arena.tournamentPresenter} />;
    }
  };

  return (
    <>
      {config.narratorBox.arenaPreviewHighlightTutorialSpeech.length > 0 && isNarrationVisible && (
        <HighlightTutorialSpeech
          steps={config.narratorBox.arenaPreviewHighlightTutorialSpeech}
          onComplete={() => {
            setIsNarrationVisible(false);
            arena.buildingPresenter.hasArenaPreviewShownNarratorBox = true;
          }}
        />
      )}
      <Modal
        isOpen={isOpen && !hideModal}
        onClose={onClose}
        className={'h-[80%] w-[80%] max-w-full'}
        isDismissable={arena.tournamentPresenter.isTournamentStarted}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Arena: {arena.hasTournament() ? arena.tournamentPresenter.tournamentModel.sport.name : ''}
          </ModalHeader>
          {arena.hasTournament() ? (
            buildTournament(arena.tournamentPresenter.tournamentModel.tournamentStatus, arena)
          ) : (
            <div className="flex justify-center items-center h-[50%] w-full">
              <h1>No tournament</h1>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
