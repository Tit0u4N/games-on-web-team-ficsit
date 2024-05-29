import { Button, Navbar, NavbarContent, NavbarItem } from '@nextui-org/react';
import React from 'react';
import './RoundStatusBar.scss';
import { ModalType } from './GameView.tsx';
import { GameCorePresenter } from '../../presenter/GameCorePresenter.ts';
import { EffectType } from '../../../audio/presenter/AudioPresenter.ts';
import { GameSettingsModal } from '@gamecore/view/React/GameSettingsComponent.tsx';

interface RoundStatusBarProps {
  nextRound: () => void;
  round: number;
  toggleModal: (type: ModalType, isOpen: boolean) => void;
  isModalOpen: (type: ModalType) => boolean;
}

function getSeason(round: number) {
  if (round < 0) round = 12 + round;
  round = round % 12;
  if (round >= 0 && round < 3) return 'summer';
  if (round >= 3 && round < 6) return 'autumn';
  if (round >= 6 && round < 9) return 'winter';
  if (round >= 9 && round < 12) return 'spring';
}

function getSeasonIcon(round: number) {
  if (round < 0) round = 12 + round;
  round = round % 12;
  if (round >= 0 && round < 3) return '☀';
  if (round >= 3 && round < 6) return '🍂';
  if (round >= 6 && round < 9) return '❄';
  if (round >= 9 && round < 12) return '🌸';
}

function getSeasonList(round: number): number[] {
  const list = [];
  for (let i = 0; i < 12; i++) {
    list.push(round - 1 + i + (12 % 12));
  }
  return list;
}

export const RoundStatusBar: React.FC<RoundStatusBarProps> = ({ nextRound, round, toggleModal, isModalOpen }) => {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  return (
    <Navbar className={'fixed-top navbar'}>
      <NavbarContent>
        <NavbarItem>
          <Button
            color={isModalOpen(ModalType.RULES) ? 'primary' : undefined}
            className={isModalOpen(ModalType.RULES) ? 'text-white' : ''}
            onClick={() => toggleModal(ModalType.RULES, !isModalOpen(ModalType.RULES))}>
            Rules
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            color={isModalOpen(ModalType.INVENTORY) ? 'primary' : undefined}
            className={isModalOpen(ModalType.INVENTORY) ? 'text-white' : ''}
            onClick={() => toggleModal(ModalType.INVENTORY, !isModalOpen(ModalType.INVENTORY))}>
            Inventory
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent>
        <div>Year {Math.floor(round / 12) + 1}</div>
        <div>Month {(round % 12) + 1}</div>
        <div className={'season-status'}>
          {getSeasonList(round).map((r, i) => (
            <span key={i} className={(r === round ? 'current' : '') + ` season-bar ${getSeason(r)}`}>
              {getSeasonIcon(r)}
            </span>
          ))}
        </div>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            onClick={() => {
              GameCorePresenter.AUDIO_PRESENTER.playEffect(EffectType.OPEN);
              setIsSettingsOpen(true);
            }}>
            Settings
          </Button>
          {isSettingsOpen && (
            <GameSettingsModal
              audioPresenter={GameCorePresenter.AUDIO_PRESENTER}
              onClose={() => {
                GameCorePresenter.AUDIO_PRESENTER.playEffect(EffectType.OPEN);
                setIsSettingsOpen(false);
              }}
            />
          )}
        </NavbarItem>
        <NavbarItem>
          <Button onClick={() => nextRound()}>Next round</Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
