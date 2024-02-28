import React from 'react';
import { Inventory } from '../../model/Inventory.ts';
import {
  Card,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure, CardBody, Divider, CardHeader, Image,
} from '@nextui-org/react';
import { ModalType } from '../../../gamecore/view/React/GameView.tsx';

export interface InventoryLayoutProps {
  inventory: Inventory[];
  toggleModal: (type: ModalType, isOpen: boolean) => void;
  isModalOpen: (type: ModalType) => boolean;
}

const InventoryLayout: React.FC<InventoryLayoutProps> = ({ inventory, toggleModal, isModalOpen }) => {
  const { onOpenChange } = useDisclosure();
  const handleClose = () => {
    toggleModal(ModalType.INVENTORY, !isModalOpen(ModalType.INVENTORY));
  };
  return (
    <Modal isOpen={true} onOpenChange={onOpenChange} onClose={handleClose} className='h-[75%] w-[80%] max-w-full'>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className='flex flex-col gap-1'>Inventory</ModalHeader>
            <ModalBody className='flex flex-row justify-center'>
              {inventory.map((item, index) => (
                <>
                  <div className='flex flex-col justify-center'>
                    <Card
                      radius='lg'
                      className='border-none w-[380px] h-[300px] bg-green-500'
                      key={index}
                    >
                      <div className='flex'>
                        {/*
                      The first CardBody will contain the equipment empty slots (4, head, chest, legs, feet)
                      */}
                        <div className='grid gap-4 p-[10px]'>
                          {Array.from({ length: 4 }, (_, index) => (
                            <div key={index} className='size-[50px] border-2 p-[8px]'></div>
                          ))}
                        </div>
                        <Divider orientation={'vertical'} />
                        {/*
                      The second one will be the Character display with the stuff he has equiped
                      */}
                        <div className='block bg-green-400 size-full ml-8 mr-8 mt-[1rem]'></div>
                      </div>
                    </Card>
                    <Card
                      radius='lg'
                      className='border-none w-[380px] h-[300px] bg-orange-500 mt-[1rem] justify-center'
                      key={index + 0.5}
                    >
                      <div className='grid grid-cols-5 gap-4 p-[10px]'>
                        {item.items.reduce((items: JSX.Element[], currentItem, index) => {
                          items.push(
                            <div key={index} className='size-[50px] border-2 p-[8px]'>
                              <img src={currentItem.image} alt={currentItem.name}
                                   className='size-full object-cover' />
                            </div>,
                          );
                          return items;
                        }, []).concat(
                          // Adding empty divs to complete the missing rows (4 maximum rows)
                          Array.from({ length: Math.max(20 - item.items.length, 0) }).map((_, emptyIndex) => (
                            <div key={`empty-${emptyIndex}`} className='size-[50px] border-2 p-[8px]'></div>
                          )))}
                      </div>

                    </Card>
                  </div>
                </>
              ))}
            </ModalBody>
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

export default InventoryLayout;
