import { GameCorePresenter } from '@gamecore/presenter/GameCorePresenter.ts';
import React from 'react';
import { Button, Tab, Tabs } from '@nextui-org/react';
import { PersonalStanding } from '@/modules/olympics/view/React/PersonalStanding.tsx';
import { TeamStanding } from '@/modules/olympics/view/React/TeamStanding.tsx';
import InventoriesModal from '@inventory/view/React/InventoriesModal.tsx';

interface OlympicsViewProps {
  presenter: GameCorePresenter;
}

export const OlympicsView: React.FC<OlympicsViewProps> = ({ presenter }) => {
  const olympicsPresenter = presenter.olympicsPresenter;
  const [inventoryOpen, setInventoryOpen] = React.useState(false);

  const toggleModal = () => {
    setInventoryOpen(!inventoryOpen);
  };

  const isModalOpen = () => {
    return inventoryOpen;
  };

  return (
    <div className={'h-[100vh] w-[100vw] bg-menu bg-cover'}>
      <InventoriesModal
        inventories={presenter.getInventoryList()}
        toggleModal={toggleModal}
        isModalOpen={isModalOpen}
        gameCorePresenter={presenter}
      />
      <div className={'size-full backdrop-blur flex items-center justify-center '}>
        <div className={'w-[85%] h-[85%]'}>
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
              <PersonalStanding presenter={olympicsPresenter} />
            </Tab>
            <Tab key={'teams'} title={'Team standing'} aria-label={'Team standing'} className={'w-[100%] max-h-[100%]'}>
              <TeamStanding presenter={olympicsPresenter} />
            </Tab>
          </Tabs>
          <div className="absolute bottom-[10%] h-[25%] flex flex-col-reverse gap-3">
            <Button>Next tournaments</Button>
            <Button onPress={() => setInventoryOpen(true)}>Inventory</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
