import { Button, Navbar, NavbarContent, NavbarItem } from '@nextui-org/react';
import React from 'react';
import './RoundStatusBar.scss';

interface RoundStatusBarProps {
  nextRound: () => void;
  round: number;
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

export const RoundStatusBar: React.FC<RoundStatusBarProps> = ({ nextRound, round }) => {
  const [isEventsMenuOpen, setIsEventsMenuOpen] = React.useState(false);
  const [isInventoryMenuOpen, setIsInventoryMenuOpen] = React.useState(false);
  return (
    <Navbar className={'fixed-top navbar'}>
      <NavbarContent>
        <NavbarItem>
          <Button
            variant={isEventsMenuOpen ? 'solid' : 'light'}
            color={isEventsMenuOpen ? 'primary' : undefined}
            className={isEventsMenuOpen ? 'text-white' : ''}
            onClick={() => setIsEventsMenuOpen(!isEventsMenuOpen)}>
            Events
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            variant={isInventoryMenuOpen ? 'solid' : 'light'}
            color={isInventoryMenuOpen ? 'primary' : undefined}
            className={isInventoryMenuOpen ? 'text-white' : ''}
            onClick={() => setIsInventoryMenuOpen(!isInventoryMenuOpen)}>
            Inventory
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent>
        <div>Year {Math.floor(round / 12)}</div>
        <div>Month {round % 12}</div>
        <div className={'season-status'}>
          <span className={`season-bar ${getSeason(round - 1)}`}>{getSeasonIcon(round - 1)}</span>
          <span className={`season-bar ${getSeason(round)} current`}>{getSeasonIcon(round)}</span>
          <span className={`season-bar ${getSeason(round + 1)}`}>{getSeasonIcon(round + 1)}</span>
          <span className={`season-bar ${getSeason(round + 2)}`}>{getSeasonIcon(round + 2)}</span>
        </div>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button onClick={() => nextRound()}>Next round</Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
