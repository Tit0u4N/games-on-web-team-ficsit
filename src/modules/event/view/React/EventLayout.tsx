import React from 'react';
import { EventModel } from '../../model/EventModel.ts';
import {
  Button,
  Card, CardBody, CardHeader,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { ModalType } from '../../../gamecore/view/React/GameView.tsx';

export interface InventoryLayoutProps {
  event: EventModel[];
  toggleModal: (type: ModalType, isOpen: boolean) => void;
  isModalOpen: (type: ModalType) => boolean;
}

export const EventLayout: React.FC<InventoryLayoutProps> = ({ event, toggleModal, isModalOpen }) => {
  const { onOpenChange } = useDisclosure();
  const handleClose = () => {
    toggleModal(ModalType.EVENTS, !isModalOpen(ModalType.EVENTS));
  };
  return (
    <Modal isOpen={true} onOpenChange={onOpenChange} onClose={handleClose} isDismissable={false}
           className='w-[20%] max-w-full fixed left-0 top-0 overflow-y-auto' backdrop={'transparent'}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className='flex flex-col gap-1'>Events</ModalHeader>
            <div className='flex flex-col max-h-[500px] overflow-y-auto'>
              <ModalBody className='flex flex-col flex-grow'>
                {event.map((item, index) => (
                  <>
                    <div className='flex flex-col justify-center'>
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
                  </>
                ))}
              </ModalBody>
            </div>
            <ModalFooter>
              <Button color='danger' variant='light' onPress={handleClose}>
                Close
              </Button>
              <Button color='primary' onPress={handleClose}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EventLayout;
