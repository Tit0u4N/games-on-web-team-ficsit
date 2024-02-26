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

function getSeasonList(round: number): number[] {
  const list = [];
  for (let i = 0; i < 12; i++) {
    list.push(round - 1 + i + (12 % 12));
  }
  return list;
}

export const RoundStatusBar: React.FC<RoundStatusBarProps> = ({ nextRound, round }) => {
  const [isEventsMenuOpen, setIsEventsMenuOpen] = React.useState(false);
  const [isInventoryMenuOpen, setIsInventoryMenuOpen] = React.useState(false);
  return (
    <Navbar className={'fixed-top navbar'}>
      <NavbarContent>
        <NavbarItem>
          <Button
            color={isEventsMenuOpen ? 'primary' : undefined}
            className={isEventsMenuOpen ? 'text-white' : ''}
            onClick={() => setIsEventsMenuOpen(!isEventsMenuOpen)}>
            Events
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            color={isInventoryMenuOpen ? 'primary' : undefined}
            className={isInventoryMenuOpen ? 'text-white' : ''}
            onClick={() => setIsInventoryMenuOpen(!isInventoryMenuOpen)}>
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
          <Button onClick={() => nextRound()}>Next round</Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
