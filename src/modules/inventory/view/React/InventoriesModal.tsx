import React from 'react';
import { Inventory } from '@inventory/model/Inventory.ts';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';
import { InventoryLayout } from './InventoryLayout.tsx';
import { ModalType } from '@gamecore/view/React/GameView.tsx';
import { GameCorePresenter } from '@gamecore/presenter/GameCorePresenter.ts';

export interface InventoryModalProps {
  inventories: Inventory[];
  gameCorePresenter: GameCorePresenter;
  toggleModal: (type: ModalType, isOpen: boolean) => void;
  isModalOpen: (type: ModalType) => boolean;
  isOpen?: boolean;
}

const InventoriesModal: React.FC<InventoryModalProps> = ({
  inventories,
  gameCorePresenter,
  toggleModal,
  isModalOpen,
  isOpen,
}) => {
  const { onOpenChange } = useDisclosure();
  const handleClose = () => {
    toggleModal(ModalType.INVENTORY, !isModalOpen(ModalType.INVENTORY));
  };

  return (
    <Modal
      isOpen={isOpen !== undefined ? isOpen : isModalOpen(ModalType.INVENTORY)}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      className="h-[80%] w-[80%] max-w-full">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">Inventory</ModalHeader>
            <ModalBody className="flex flex-row justify-between py-6">
              {inventories.map((inventory, index) => (
                <InventoryLayout inventory={inventory} key={index} gameCorePresenter={gameCorePresenter} />
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
