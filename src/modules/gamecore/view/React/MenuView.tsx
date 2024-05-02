import React from 'react';
import { Button, Card, CardBody, Divider, Tab, Tabs } from '@nextui-org/react';
import { GameCorePresenter } from '../../presenter/GameCorePresenter.ts';
import { SwitchOption } from '../../../../component/options/SwitchOption.tsx';
import { SelectOption } from '../../../../component/options/SelectOption.tsx';

interface Props {
  presenter: GameCorePresenter;
}

export const MenuView: React.FC<Props> = ({ presenter }) => {
  const cardSize = ' w-[500px] h-[600px] p-2';

  return (
    <div className={'h-[100vh] w-[100vw] bg-menu bg-cover'}>
      <div className={'size-full backdrop-blur flex flex-col items-center justify-center'}>
        <div className={'mt-[-50px] h-1/2 font-semibold'}>
          <Tabs size={'lg'} fullWidth={true}>
            <Tab key={'game'} title={'Game'} className={'h-[50px] '}>
              <Card className={cardSize}>
                <CardBody>Game</CardBody>
              </Card>
            </Tab>
            <Tab key={'options'} title={'Options'} className={'h-[50px]'}>
              <Card className={cardSize}>
                <CardBody className={'flex flex-col'}>
                  <div className={'w-full'}>
                    <h3 className={'text-xl pb-2'}> Graphics </h3>
                    <div className={'flex flex-col w-full'}>
                      <SwitchOption value={true} title={'Shadows'} description={'Active shadows'} />
                      <DividerOptions />
                      <SelectOption title={'Decorations'} description={'Number of decoration'} option={'trees'} />
                    </div>
                  </div>
                  <p className={'text-center text-gray-500'}>
                    {' '}
                    These options can only be changed before the start of the game.{' '}
                  </p>
                </CardBody>
              </Card>
            </Tab>
            <Tab key={'credit'} title={'Credit'} className={'h-[50px]'}>
              <Card className={cardSize}>
                <CardBody>Credit</CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
        <Button
          color="primary"
          className={'w-[250px] h-[75px] text-white text-3xl'}
          onClick={() => presenter.startGame()}>
          Start Game
        </Button>
      </div>
    </div>
  );
};

const DividerOptions = () => {
  return <Divider className={'my-2'}></Divider>;
};
