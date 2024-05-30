import { OlympicsPresenter } from '@/modules/olympics/presenter/OlympicsPresenter.ts';
import React, { FC } from 'react';
import { Button, Tab, Tabs } from '@nextui-org/react';
import { PersonalStanding } from '@/modules/olympics/view/React/PersonalStanding.tsx';
import { TeamStanding } from '@/modules/olympics/view/React/TeamStanding.tsx';
import InventoriesModal from '@inventory/view/React/InventoriesModal.tsx';

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
    <>
      <InventoriesModal
        inventories={presenter.gameCorePresenter.getInventoryList()}
        toggleModal={toggleModal}
        isModalOpen={isModalOpen}
        gameCorePresenter={presenter.gameCorePresenter}
      />
      <Tabs
        size={'lg'}
        aria-label={'Menu'}
        color="primary"
        isVertical={true}
        className={'max-h-[100%]'}
        classNames={{
          wrapper: 'max-h-[100%]',
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
      <div className="absolute bottom-[10%] h-[25%] flex flex-col-reverse gap-3">
        <Button onPress={() => presenter.olympicsModel.nextTournament()}>Next tournaments</Button>
        <Button onPress={() => setInventoryOpen(true)}>Inventory</Button>
      </div>
    </>
  );
};
