import React from 'react';
import { Inventory } from '../../model/Inventory.ts';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';
import { ModalType } from '../../../gamecore/view/React/GameView.tsx';
import { InventoryLayout } from './InventoryLayout.tsx';

export interface InventoryModalProps {
  inventories: Inventory[];
  toggleModal: (type: ModalType, isOpen: boolean) => void;
  isModalOpen: (type: ModalType) => boolean;
}

const InventoriesModal: React.FC<InventoryModalProps> = ({ inventories, toggleModal, isModalOpen }) => {
  const { onOpenChange } = useDisclosure();
  const handleClose = () => {
    toggleModal(ModalType.INVENTORY, !isModalOpen(ModalType.INVENTORY));
  };

  return (
    <Modal isOpen={true} onOpenChange={onOpenChange} onClose={handleClose} className="h-[80%] w-[80%] max-w-full">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">Inventory</ModalHeader>
            <ModalBody className="flex flex-row justify-between py-6">
              {inventories.map((inventory, index) => (
                <InventoryLayout inventory={inventory} key={index} />
              ))}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={handleClose}>
                Close
              </Button>
              <Button color="primary" onPress={handleClose}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default InventoriesModal;
