import React from 'react';
import { ModalBody } from '@nextui-org/react';
import { Character } from '../../../character/model/Character.ts';
import CharacterLayout from '../../../character/view/React/CharacterLayout.tsx';
import { TournamentPresenter } from '../../presenter/TournamentPresenter.ts';

interface Props {
  tournament: TournamentPresenter;
}

export const TournamentView: React.FC<Props> = ({ tournament }) => {
  return (
    <ModalBody className={'flex'}>
      <div className={'w-1/3'}>
        {/*{*/}
        {/*  characters.map((character, index) => (*/}
        {/*    <CharacterLayout key={index} character={character} />*/}
        {/*  ))*/}
        {/*}*/}
      </div>
      <div className={'w-2/3'}></div>
    </ModalBody>
  );
};
