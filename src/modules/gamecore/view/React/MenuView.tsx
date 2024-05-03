import React from 'react';
import { Button, Card, CardBody, Divider, Tab, Tabs } from '@nextui-org/react';
import { GameCorePresenter } from '../../presenter/GameCorePresenter.ts';
import { SwitchOption } from '../../../../component/options/SwitchOption.tsx';
import { SelectOption } from '../../../../component/options/SelectOption.tsx';
import { AvatarCredit } from '../../../../component/AvatarCredit.tsx';

interface Props {
  presenter: GameCorePresenter;
}

export const MenuView: React.FC<Props> = ({ presenter }) => {
  const cardSize = ' w-[500px] h-[600px] p-2';

  return (
    <div className={'h-[100vh] w-[100vw] bg-menu bg-cover'}>
      <div className={'size-full backdrop-blur flex flex-col items-center justify-center'}>
        <div className={'mt-[-50px] h-1/2 font-semibold'}>
          <Tabs size={'lg'} fullWidth={true} aria-label={'Menu'}>
            <Tab key={'game'} title={'Game'} aria-label={'Menu Game'} className={'h-[50px] '}>
              <Card className={cardSize}>
                <CardBody>Game</CardBody>
              </Card>
            </Tab>
            <Tab key={'options'} title={'Options'} aria-label={'Menu Options'} className={'h-[50px]'}>
              <Card className={cardSize}>
                <CardBody className={'flex flex-col'}>
                  <div className={'w-full'}>
                    <h3 className={'text-xl pb-2'}> Graphics </h3>
                    <div className={'flex flex-col w-full'}>
                      <SwitchOption title={'Shadows'} description={'Active shadows'} option={'shadow'} />
                      <DividerOptions />
                      <SelectOption title={'Trees'} description={'Number of trees'} option={'trees'} />
                      <DividerOptions />
                      <SelectOption title={'Rocks'} description={'Number of rocks'} option={'trees'} />
                    </div>
                  </div>
                  <p className={'text-center text-gray-500'}>
                    {' '}
                    These options can only be changed before the start of the game.{' '}
                  </p>
                </CardBody>
              </Card>
            </Tab>
            <Tab key={'credit'} title={'Credit'} aria-label={'Menu Credit'} className={'h-[50px]'}>
              <Card className={cardSize}>
                <CardBody className="flex flex-col gap-8">
                  <AvatarCredit
                    image={'/img/avatar_titou.jpg'}
                    name={'Titouan Lacombe--Fabre'}
                    githubName={'Titu04N'}
                    github={'https://github.com/Tit0u4N'}
                  />
                  <AvatarCredit
                    image={'/img/avatar_titou.jpg'}
                    name={'Titouan Lacombe--Fabre'}
                    githubName={'Titu04N'}
                    github={'https://github.com/Tit0u4N'}
                  />
                  <AvatarCredit
                    image={'/img/avatar_titou.jpg'}
                    name={'Titouan Lacombe--Fabre'}
                    githubName={'Titu04N'}
                    github={'https://github.com/Tit0u4N'}
                  />
                </CardBody>
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
