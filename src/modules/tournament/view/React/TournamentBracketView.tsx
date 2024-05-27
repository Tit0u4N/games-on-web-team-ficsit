import { TournamentPresenter } from '../../presenter/TournamentPresenter.ts';
import { BracketObject, Bracketv1 } from './bracket/Bracketv1.tsx';
import React from 'react';
import { Button, Divider, ModalBody } from '@nextui-org/react';
import InventoriesModal from '../../../inventory/view/React/InventoriesModal.tsx';

interface Props {
  tournament: TournamentPresenter;
  onStatusChange: () => void;
}

export const TournamentBracketView: React.FC<Props> = ({ tournament, onStatusChange }) => {
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
      if (tournament.tournamentModel.tournamentStatus === 'finished') onStatusChange();
    }, 1000);
    tournament.playNextRound();
  };

  const skipTournament = () => {
    tournament.tournamentModel.skipTournament();
    onStatusChange();
  };

  const gameCorePresenter = tournament.tournamentManagerPresenter.gameCorePresenter;
  const [inventoryOpen, setInventoryOpen] = React.useState(false);

  const toggleModal = () => {
    setInventoryOpen(!inventoryOpen);
  };

  const isModalOpen = () => {
    return inventoryOpen;
  };

  return (
    <>
      <InventoriesModal
        inventories={gameCorePresenter.getInventoryList()}
        toggleModal={toggleModal}
        isModalOpen={isModalOpen}
        gameCorePresenter={gameCorePresenter}
      />
      <ModalBody>
        <div className={'flex gap-3 h-full m-1'}>
          <Bracketv1 bracket={bracketObjects} />
          <Divider orientation={'vertical'} />
          <div className={'flex-col flex gap-2 p-4 mr-4 h-full justify-center'}>
            <Button
              onPress={() => {
                setInventoryOpen(true);
              }}>
              Inventory
            </Button>
            <Button onPress={() => nextRound()} isDisabled={isNextRoundDisabled} className="my-3">
              Next round
            </Button>
            {!tournament.tournamentModel.isUserCharacterStillInTournament() && (
              <>
                <p>All your athletes have been eliminated</p>
                <Button onPress={() => skipTournament()}>Skip tournament</Button>
              </>
            )}
          </div>
        </div>
      </ModalBody>
    </>
  );
};
