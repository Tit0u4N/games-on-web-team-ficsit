import { Button, Navbar, NavbarContent, NavbarItem } from '@nextui-org/react';
import React from 'react';

interface RoundStatusBarProps {
  nextRound: () => void;
  round: number;
}

export const RoundStatusBar: React.FC<RoundStatusBarProps> = ({ nextRound, round }) => {
  const [isEventsMenuOpen, setIsEventsMenuOpen] = React.useState(false);
  const [isInventoryMenuOpen, setIsInventoryMenuOpen] = React.useState(false);
  return (
    <Navbar className={'fixed-top'}>
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
        <div>Round {round}</div>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button onClick={() => nextRound()}>Next round</Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
