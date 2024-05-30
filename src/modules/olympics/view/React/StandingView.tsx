import { OlympicsPresenter } from '@/modules/olympics/presenter/OlympicsPresenter.ts';
import React, { FC } from 'react';
import { Button, Card, CardBody, Image, ModalBody, Tab, Tabs } from '@nextui-org/react';
import { PersonalStanding } from '@/modules/olympics/view/React/PersonalStanding.tsx';
import { TeamStanding } from '@/modules/olympics/view/React/TeamStanding.tsx';
import InventoriesModal from '@inventory/view/React/InventoriesModal.tsx';
import { OlympicsState } from '@/modules/olympics/model/OlympicsModel.ts';

interface StandingViewProps {
  presenter: OlympicsPresenter;
}

export const StandingView: FC<StandingViewProps> = ({ presenter }) => {
  const [inventoryOpen, setInventoryOpen] = React.useState(false);

  const toggleModal = () => {
    setInventoryOpen(!inventoryOpen);
  };

  const isModalOpen = () => {
    return inventoryOpen;
  };
  return (
    <ModalBody className={'w-[85%] h-[85%] my-6 mx-auto max-h-[85%] '}>
      <InventoriesModal
        inventories={presenter.gameCorePresenter.getInventoryList()}
        toggleModal={toggleModal}
        isModalOpen={isModalOpen}
        gameCorePresenter={presenter.gameCorePresenter}
      />
      {presenter.olympicsModel.state === OlympicsState.FINISHED && (
        <Card className="my-2 mx-auto overflow-visible">
          <CardBody>
            <p className="my-1 font-semibold text-center text-lg">Final Standings</p>
            <p className="my-1"> Congratulations you finished the Olympics Games</p>
            <p className="my-1"> Your team finished in {presenter.getTeamRank()} place </p>
            <p className="my-1 font-semibold text-center"> Thanks for playing!</p>
          </CardBody>
        </Card>
      )}
      <Tabs
        size={'lg'}
        aria-label={'Menu'}
        color="primary"
        isVertical={true}
        className={'max-h-[100%]'}
        classNames={{
          wrapper: presenter.olympicsModel.state === OlympicsState.FINISHED ? 'max-h-[70%]' : 'max-h-[100%]',
        }}>
        <Tab
          key={'personal'}
          title={'Personal standing'}
          aria-label={'Personal standing'}
          className={'w-[100%] max-h-[100%]'}>
          <PersonalStanding presenter={presenter} />
        </Tab>
        <Tab key={'teams'} title={'Team standing'} aria-label={'Team standing'} className={'w-[100%] max-h-[100%]'}>
          <TeamStanding presenter={presenter} />
        </Tab>
      </Tabs>
      {presenter.olympicsModel.state !== OlympicsState.FINISHED && (
        <div className="absolute bottom-[10%] h-[25%] flex flex-col-reverse gap-3">
          <Button onPress={() => presenter.olympicsModel.nextTournament()}>Next tournament</Button>
          <Button onPress={() => setInventoryOpen(true)}>Inventory</Button>
          {presenter.getNextTournament() && (
            <div>
              <div>Next Tournament:</div>
              <div className="flex">
                <Image
                  src={presenter.getNextTournament()?.tournamentModel.sport.iconPath}
                  width={20}
                  alt="sport image"
                />
                <span className="ml-2">{presenter.getNextTournament()?.tournamentModel.sport.name}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </ModalBody>
  );
};
