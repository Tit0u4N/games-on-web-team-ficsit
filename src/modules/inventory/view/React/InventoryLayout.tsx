import { Card, Divider, Image, Slider } from '@nextui-org/react';
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
            <div className="max-h-full w-full">
              <div className="h-[100%] grid grid-rows-6 my-1 mx-1">
                {Array.from(inventory.character.statistics.keys()).map((sport, index) => (
                  <div key={index} className="h-1/6 max-h-[16.66%]">
                    <div className="grid grid-cols-5">
                      <div>
                        <Image src={sport.iconPath} className={'max-h-[25px]'} />{' '}
                      </div>
                      <div className="col-span-2">{sport.name}</div>
                      <div>{inventory.character.statistics.get(sport)}</div>
                      <div>
                        {inventory.character.getStatsWithEffect(gameCorePresenter.getCurrentSeason()).get(sport) -
                          inventory.character.statistics.get(sport) >
                        0
                          ? '+' +
                            (inventory.character.getStatsWithEffect(gameCorePresenter.getCurrentSeason()).get(sport) -
                              inventory.character.statistics.get(sport))
                          : ''}
                      </div>
                    </div>
                    <div>
                      <Slider
                        aria-label="Player progress"
                        color="primary"
                        hideThumb={true}
                        size="sm"
                        value={
                          inventory.character
                            .getStatsWithEffect(gameCorePresenter.getCurrentSeason())
                            .getPercentage(sport).percentageFilled
                        }
                        minValue={0}
                        maxValue={100}
                        className="max-w-[90%] mx-auto"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
