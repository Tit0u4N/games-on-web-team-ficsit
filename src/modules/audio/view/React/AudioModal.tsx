import { AudioPresenter } from '../../presenter/AudioPresenter.ts';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { AudioVolumeSetter } from './AudioVolumeSetter.tsx';
import { FC } from 'react';

export interface AudioModalProps {
  audioPresenter: AudioPresenter;
  isOpen: boolean;
  onClose: () => void;
}

export const AudioModal: FC<AudioModalProps> = ({ audioPresenter, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} className="h-[400px] w-[300px] max-w-full" onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Audio</ModalHeader>
        <ModalBody>
          <div className={'px-3 mt-2'}>
            <AudioVolumeSetter audioPresenter={audioPresenter} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
