import React from 'react';
import { Button, Card, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { ArenaModel } from '../../model/ArenaModel.ts';

export interface ArenaLayoutProps {
  arena: ArenaModel;
  isOpen: boolean;
  onClose: () => void;
}

export const ArenaLayout: React.FC<ArenaLayoutProps> = ({ arena, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="h-[80%] w-[80%] max-w-full" onClick={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">Arena</ModalHeader>
            <ModalBody className="flex flex-row justify-between py-6 h-[80%]">
              <Card radius={'lg'} className={'flex flex-col gap-1 w-[380px] p-2'}>
                <div className="w-full h-[300px]">
                  <div className="flex justify-between p-[10px] h-full w-full">
                    <div className="flex flex-col w-1/5 gap-1"></div>
                    <Divider orientation={'vertical'} />
                    <div className="w-[75%] h-full flex rounded-xl bg-case"></div>
                  </div>
                </div>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onClick={onClose}>
                Close
              </Button>
              <Button color="primary">Action</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
