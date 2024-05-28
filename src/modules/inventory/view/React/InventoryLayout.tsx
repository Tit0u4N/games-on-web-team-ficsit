import {
  Card,
  Divider,
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import React from 'react';
import { InventoryCase } from '@/component/InventoryCase.tsx';
import { Inventory } from '../../model/Inventory.ts';
import { config } from '@core/Interfaces.ts';
import { EquippedObjectSlot } from '../../model/EquippedObjects.ts';
import { GameCorePresenter } from '@gamecore/presenter/GameCorePresenter.ts';

type InventoryLayoutProps = {
  inventory: Inventory;
  gameCorePresenter: GameCorePresenter;
};

export const InventoryLayout: React.FC<InventoryLayoutProps> = ({ inventory, gameCorePresenter }) => {
  const [update, setUpdate] = React.useState(false);

  return (
    <Card radius={'lg'} className={'flex flex-col gap-1 w-[380px] p-2'}>
      <div className="w-full h-[300px]">
        <div className="flex justify-between p-[10px] h-full w-full">
          <div className="flex flex-col w-1/5 gap-1">
            <InventoryCase inventory={inventory} slot={EquippedObjectSlot.HEAD} onChange={() => setUpdate(!update)} />
            <InventoryCase inventory={inventory} slot={EquippedObjectSlot.CHEST} onChange={() => setUpdate(!update)} />
            <InventoryCase inventory={inventory} slot={EquippedObjectSlot.LEGS} onChange={() => setUpdate(!update)} />
            <InventoryCase inventory={inventory} slot={EquippedObjectSlot.FEET} onChange={() => setUpdate(!update)} />
          </div>

          <Divider orientation={'vertical'} />

          <div className="w-[75%] h-full flex rounded-xl bg-case">
            <Table
              className="max-h-full"
              removeWrapper
              hideHeader
              classNames={{
                base: 'max-h-full',
                table: 'max-h-full',
                tr: 'h-1/6',
              }}>
              <TableHeader>
                <TableColumn>Icon</TableColumn>
                <TableColumn>Sport</TableColumn>
                <TableColumn>Stat</TableColumn>
                <TableColumn>Bonus</TableColumn>
              </TableHeader>
              <TableBody className="max-h-[100%]">
                {Array.from(inventory.character.statistics.keys()).map((sport, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Image src={sport.iconPath} className={'max-h-[30px]'} />{' '}
                    </TableCell>
                    <TableCell>{sport.name}</TableCell>
                    <TableCell>{inventory.character.statistics.get(sport)}</TableCell>
                    <TableCell>
                      {inventory.character.getStatsWithEffect(gameCorePresenter.getCurrentSeason()).get(sport) -
                        inventory.character.statistics.get(sport) >
                      0
                        ? '+' +
                          (inventory.character.getStatsWithEffect(gameCorePresenter.getCurrentSeason()).get(sport) -
                            inventory.character.statistics.get(sport))
                        : ''}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <Divider />
      <div className="w-full h-[300px] justify-center">
        <div className="grid grid-cols-5 gap-1 p-[10px]">
          {Array.from({ length: config.character.model.inventory.maxItems }, (_, index) => (
            <InventoryCase key={index} position={index} inventory={inventory} onChange={() => setUpdate(!update)} />
          ))}
        </div>
      </div>
    </Card>
  );
};
