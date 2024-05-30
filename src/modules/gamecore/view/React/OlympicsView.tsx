import { GameCorePresenter } from '@gamecore/presenter/GameCorePresenter.ts';
import { StandingView } from '@/modules/olympics/view/React/StandingView.tsx';
import React, { FC } from 'react';
import { OlympicsState } from '@/modules/olympics/model/OlympicsModel.ts';
import { OlympicsTournamentView } from '@/modules/olympics/view/React/OlympicsTournamentView.tsx';
import { ModalManager } from '@core/singleton/ModalManager.ts';
import { Modal, ModalContent } from '@nextui-org/react';

interface OlympicsViewProps {
  presenter: GameCorePresenter;
}

export const OlympicsView: FC<OlympicsViewProps> = ({ presenter }) => {
  const [, handle] = React.useState(true);
  ModalManager.getInstance().modalUpdaterHandler = handle;

  const [hideModal, setHideModal] = React.useState<boolean>(false);

  return (
    <Modal
      isOpen={!hideModal}
      className={'h-[80%] w-[80%] max-w-full m-8'}
      backdrop="transparent"
      isDismissable={false}
      hideCloseButton={true}>
      <ModalContent className={'flex items-center justify-center'}>
        <div className={'w-[85%] h-[85%]'}>
          {presenter.olympicsPresenter.olympicsModel.state == OlympicsState.STANDINGS ? (
            <StandingView presenter={presenter.olympicsPresenter} />
          ) : (
            <OlympicsTournamentView presenter={presenter.olympicsPresenter} />
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};
