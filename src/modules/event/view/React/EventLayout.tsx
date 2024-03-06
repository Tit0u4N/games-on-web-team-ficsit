import React from 'react';
import { EventModel } from '../../model/EventModel.ts';
import { Button, Card, CardBody, CardHeader, Divider, Image } from '@nextui-org/react';
import { ModalType } from '../../../gamecore/view/React/GameView.tsx';
import { AnimatePresence, motion } from 'framer-motion';

export interface InventoryLayoutProps {
  event: EventModel[];
  toggleModal: (type: ModalType, isOpen: boolean) => void;
  isModalOpen: (type: ModalType) => boolean;
}

export const EventLayout: React.FC<InventoryLayoutProps> = ({ event, toggleModal, isModalOpen }) => {
  const handleClose = () => {
    toggleModal(ModalType.EVENTS, !isModalOpen(ModalType.EVENTS));
  };
  return (
    <AnimatePresence>
      {isModalOpen(ModalType.EVENTS) && (
        <motion.div
          key='modal'
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ ease: 'easeInOut', duration: 0.6 }}
          className={
            'w-[25%] max-w-full fixed left-0 bg-background/90 backdrop-blur-xl z-30 p-4 rounded-r-lg mt-[4rem] h-[calc(100%-4rem)] flex flex-col gap-2 justify-between shadow-lg'
          }>
          <p className='p-2 text-xl'>Events</p>
          <div className='flex flex-col overflow-y-auto max-h-[90%] p-4'>
            {event.map((item, index) => (
              <div className='flex flex-col justify-center my-2' key={index}>
                <Card className='max-w-[400px]'>
                  <CardHeader className='flex gap-3'>
                    <Image
                      alt='nextui logo'
                      height={40}
                      radius='sm'
                      src='https://avatars.githubusercontent.com/u/86160567?s=200&v=4'
                      width={40}
                    />
                    <div className='flex flex-col'>
                      <p className='text-md'>NextUI</p>
                      <p className='text-small text-default-500'>nextui.org</p>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <p>{item.toString()}</p>
                  </CardBody>
                  <Divider />
                </Card>
              </div>
            ))}
          </div>
          <div className={'bottom-0 p-4 flex justify-end'}>
            <Button color='danger' variant='light' onPress={handleClose}>
              Close
            </Button>
            <Button color='primary' onPress={handleClose}>
              Action
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventLayout;
