import React from 'react';
import { ModalBody } from '@nextui-org/react';
import { TournamentPresenter } from '../../presenter/TournamentPresenter.ts';
import { NPCList } from './NPCList.tsx';
import { DiceComponent } from '../../../dice/view/React/DiceComponent.tsx';

interface Props {
  tournament: TournamentPresenter;
  setHideModal: (hide: boolean) => void;
}

export const TournamentView: React.FC<Props> = ({ tournament, setHideModal }) => {
  const model = tournament.tournamentModel;

  const npcs = [{}, {}, {}, {}, {}, {}, {}, {}, {}];

  return (
    <ModalBody className={'flex-row'}>
      <div className={'w-1/3 flex'}>
        {/*{*/}
        {/*  model.characters.map((character, index) => (*/}
        {/*  ))*/}
        {/*}*/}
        TODO CharacterLayout
      </div>
      <div className={'w-2/3 flex flex-col gap-4'}>
        <NPCList npcs={npcs} />
        <div className={'flex h-full gap-4'}>
          <div className={'w-2/3'}></div>
          <div className={'w-1/3 flex flex-col gap-4'}>
            <div className={'flex size-full border border-default-200 rounded-2xl'}>Boom</div>
            <div className={'flex h-auto w-full border border-default-200 rounded-2xl'}>
              <DiceComponent
                className={'w-full p-2 flex items-center justify-around'}
                dicePresenter={tournament.dicePresenter}
                onRoll3DStart={() => {
                  setHideModal(true);
                }}
                onRoll3DEnd={() => {
                  setTimeout(() => {
                    setHideModal(false);
                  }, 2000);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </ModalBody>
  );
};
