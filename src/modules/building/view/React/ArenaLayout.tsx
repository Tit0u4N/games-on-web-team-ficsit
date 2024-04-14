import { Button, Card, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React from 'react';
import { ArenaModel } from '../../model/ArenaModel.ts';

export interface ArenaLayoutProps {
  arena: ArenaModel;
}

export const ArenaLayout: React.FC<ArenaLayoutProps> = ({ arena }) => {
  return (
    <Modal isOpen={true} className="h-[80%] w-[80%] max-w-full">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">Inventory</ModalHeader>
            <ModalBody className="flex flex-row justify-between py-6">
              <Card radius={'lg'} className={'flex flex-col gap-1 w-[380px] p-2'}>
                <div className="w-full h-[300px]">
                  <div className="flex justify-between p-[10px] h-full w-full">
                    <div className="flex flex-col w-1/5 gap-1"></div>
                    <Divider orientation={'vertical'} />
                    <div className="w-[75%] h-full flex rounded-xl bg-case"></div>
                  </div>
                </div>
                <Divider />
                <div className="w-full h-[300px] justify-center">
                  <div className="grid grid-cols-5 gap-1 p-[10px]"></div>
                </div>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light">
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
