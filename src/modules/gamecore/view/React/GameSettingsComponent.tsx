import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Divider,
} from '@nextui-org/react';
import { AudioComponent } from '@/modules/audio/view/React/AudioComponent.tsx';
import { ControlOptions } from '@/component/options/ControlOptions.tsx';
import { AudioPresenter } from '@/modules/audio/presenter/AudioPresenter.ts';

export interface GameSettingsComponentProps {
  audioPresenter: AudioPresenter;
  onClose: () => void;
}

export const GameSettingsModal: React.FC<GameSettingsComponentProps> = ({ audioPresenter, onClose }) => {
  const { onOpenChange } = useDisclosure();

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal isOpen={true} onOpenChange={onOpenChange} onClose={handleClose} className="h-[80%] w-[500px] max-w-full">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex justify-center mt-5">
              <div className="text-xl font-semibold">Game Settings</div>
            </ModalHeader>
            <ModalBody>
              <div className="text-lg font-semibold">Audio</div>
              <AudioComponent audioPresenter={audioPresenter} />
              <Divider className={'my-2 mt-5'}></Divider>
              <div className="text-lg font-semibold mt-5">Controls</div>
              <ControlOptions />
            </ModalBody>
            <ModalFooter className="flex justify-end">
              <Button color="danger" variant="light" onPress={handleClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
